# Chia 🌱

A full-stack nutrition coach app — log a craving, get a healthier **swap** suggestion from an
LLM, keep a journal, build streaks, and see weekly insights.

> **Read this like a review.** The first three sections (Stack → Architecture → File map) tell you
> *what exists* in 60 seconds. Everything after is reference detail (wrappers, data model, API,
> deploy, gotchas) you can jump to when you need it.

---

## 1. Stack (what's actually wired up)

| Layer | Choice | Notes |
|-------|--------|-------|
| **Frontend** | Next.js 16, React 19, Tailwind v4, shadcn, Zustand, TanStack Query, Recharts | App Router |
| **Backend** | FastAPI, async SQLAlchemy + asyncpg, FastAPI Users (JWT) | bare imports, run with `uvicorn main:app` |
| **AI** | **Groq — Llama 3.1 8B Instant**, driven by **PydanticAI** agents | structured output, not free text |
| **Database** | Supabase Postgres via the **Session pooler**; Alembic migrations | |
| **Deploy** | Backend → Render · Frontend → Vercel | |

> ⚠️ **Heads-up on the `.env`:** `app/.env` still carries leftover `Firebase` / `Gemini` keys
> from an earlier direction. They are **unused** — `config.py` ignores them and the live AI path is
> **Groq via PydanticAI**. Don't trust the `.env` to tell you what the app runs on; trust
> `app/services/`.

---

## 2. Architecture at a glance

```
Browser (Next.js)
  │  fetch + JWT bearer (lib/api.ts wrapper)
  ▼
FastAPI (app/main.py)
  ├─ /auth, /users      → FastAPI Users (users.py)        — JWT auth, register/login/me
  ├─ /swap              → swap_engine     → Groq (PydanticAI agent)  → logs Swap row
  ├─ /journal           → writes Journal  + updates Streak (same txn)
  ├─ /streak            → streak_engine   (pure logic, no AI)
  └─ /insights/weekly   → insights_engine → SQL stats + Groq summary
        │
        ▼
   Supabase Postgres (async SQLAlchemy, Session pooler)
```

**Design principle worth remembering:** numbers are computed in **SQL** (always accurate); the LLM
only ever writes **prose** (summaries, tips, swap reasons). The swap/insights agents are forced to
return Pydantic models (`PromptedOutput`), so the API never parses free-form text.

---

## 3. Repository layout — one repo, three branches

This project lives in **one GitHub repo (`anandha-3679/Chia`) split across three branches**, each
rooted at a different folder on disk:

| Local folder | Git branch | Deploys to | Contents |
|--------------|-----------|------------|----------|
| `app/`        | `backend` | Render  | FastAPI service + Alembic migrations |
| `frontend/`   | `frontend`| —       | Next.js app (source of truth) |
| `Chia/` (root)| `main`    | Vercel  | Frontend at root (merged from `frontend`) + `prd.md`, `chia-logo.png` |

> `app/` and `frontend/` are each their **own git repo** with a remote pointing at the same GitHub
> repo. The root `Chia/` repo's `main` branch carries the frontend at its root so Vercel builds from
> the repo root.

```
Chia/
├── app/            # backend repo  -> branch: backend
├── frontend/       # frontend repo -> branch: frontend
├── prd.md          # product spec
├── chia-logo.png
└── README.md       # this file (local only)
```

---

## 4. File map (every module uploaded, one line each)

### Backend — `app/`
| File | What it is |
|------|------------|
| `main.py` | App entry. Mounts CORS + all routers, `/health` + `/health/db` checks. |
| `users.py` | **FastAPI Users wrapper** — user DB, `UserManager`, JWT bearer backend, `current_active_user` dependency. |
| `core/config.py` | **Settings wrapper** (pydantic-settings) — loads `.env`, exposes `async_database_url` (rewrites to `postgresql+asyncpg://`). |
| `core/database.py` | **Async DB wrapper** — engine, `async_sessionmaker`, `Base`, `get_db()` dependency. |
| `api/auth.py` | Assembles FastAPI Users' prebuilt register/login/logout + `/users/me` routers. |
| `api/swap.py` | `POST /swap` — calls swap_engine, logs the suggestion, returns it. |
| `api/journal.py` | `POST/GET /journal` — log + list entries; bumps streak in the same txn. |
| `api/streak.py` | `GET /streak`. |
| `api/insights.py` | `GET /insights/weekly`. |
| `services/swap_engine.py` | **Groq swap agent** (PydanticAI). System prompt + `generate_swap(craving, diet, goal)` → `SwapResponse`. |
| `services/insights_engine.py` | **Insights wrapper** — SQL stats (7-day rolling) + Groq agent for summary/tip. |
| `services/streak_engine.py` | **Streak logic** (no AI) — `update_streak_on_log`, `get_streak` with "is it alive?" check. |
| `models/` | ORM tables: `user`, `journal`, `swap`, `streak`. |
| `schemas/` | Pydantic request/response models (incl. the AI structured-output shapes). |
| `migrations/`, `alembic.ini` | Alembic migration history (schema source of truth — no `create_all`). |
| `requirements.txt` | Backend deps. |

### Frontend — `frontend/`
| File | What it is |
|------|------------|
| `lib/api.ts` | **`apiFetch` wrapper** — injects JWT bearer, JSON helper, 401 → auto-logout, `ApiError`. Plus `loginRequest` (form-encoded OAuth2), `registerRequest`, `getMe`. |
| `store/auth.ts` | **Zustand auth store** (persisted) — only the **token** is saved; user is re-fetched from `/users/me`. |
| `types/api.ts` | TS types mirroring backend schemas (`User`, `SwapResponse`, `JournalEntry`, `Streak`, `WeeklyInsights`). |
| `hooks/use-auth.ts` | login / signup / logout / update-profile / onboarding mutations (TanStack Query). |
| `hooks/use-swap.ts` · `use-journal.ts` · `use-streak.ts` · `use-insights.ts` | Per-feature query/mutation hooks over `apiFetch`. |
| `hooks/use-require-auth.ts` | Route guard for authed pages. |
| `app/(auth)/` | login + signup pages. |
| `app/onboarding/` | first-run goal + diet capture. |
| `app/app/` | the product: `chat`, `journal`, `streaks`, `insights`, `profile` (+ layout/sidebar). |
| `app/page.tsx` + `components/marketing/` | landing page (hero, features, comparison, testimonials, CTA…). |
| `components/app/` | feature UI — swap card, journal form/entry, insights charts (donut/bar/mood/recap), streak week-strip. |
| `components/ui/` | shadcn primitives (button, card, input, tabs, sheet, …). |

---

## 5. The "wrappers" (where the real logic lives)

These are the abstractions that hide vendor/transport details from the rest of the app:

- **`swap_engine` / `insights_engine`** — PydanticAI `Agent`s over `GroqModel`. They use
  `PromptedOutput` (plain JSON) instead of tool-calling because the 8B model returns valid JSON
  text far more reliably than well-formed tool calls. `retries=2` re-validates bad JSON.
  Personalization (diet + goal) is injected into the user prompt at call time.
- **`streak_engine`** — pure date logic in UTC. `update_streak_on_log` does **not** commit, so the
  journal write + streak bump are one atomic transaction.
- **`users.py`** — wraps FastAPI Users into a JWT bearer backend and the `current_active_user`
  dependency every protected route depends on.
- **`core/database.py` + `core/config.py`** — the only places that know about asyncpg / the
  connection string / the `.env`.
- **`lib/api.ts` (`apiFetch`)** — the single client-side gateway. Everything goes through it, so JWT
  injection and session-expiry handling live in exactly one place.

---

## 6. Data model

| Table | Key fields | Notes |
|-------|-----------|-------|
| `users` | id (UUID), email, hashed_password, is_active/superuser/verified, **name, goal, diet_type** | base table from FastAPI Users; profile fields added on top. `goal`/`diet_type` validated by Enums in `schemas/user.py`. |
| `journal` | id, user_id→users, craving, swap_taken, mood?, created_at | the user's logged swaps; drives insights + streaks. |
| `swaps` | id, user_id→users, craving, swap_suggested, reason, created_at | every AI suggestion, logged for later analysis. |
| `streaks` | user_id (PK→users), current_streak, best_streak, last_active_date | one row per user. |

All FKs `ON DELETE CASCADE`. Schema is owned by **Alembic**, not `create_all`.

---

## 7. API surface

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/auth/register` | — | signup (email + password + name) |
| POST | `/auth/login` | — | login → JWT (form-encoded, OAuth2 password flow) |
| POST | `/auth/logout` | ✓ | logout |
| GET/PATCH | `/users/me` | ✓ | read / update profile (name, goal, diet_type) |
| POST | `/swap` | ✓ | personalized healthier swap (+ logs a `swaps` row) |
| POST/GET | `/journal` | ✓ | log / list journal entries |
| GET | `/streak` | ✓ | current + best streak |
| GET | `/insights/weekly` | ✓ | 7-day stats + AI summary/tip |
| GET | `/health`, `/health/db` | — | liveness / readiness |

---

## 8. Run locally

### Backend (`app/`)
```bash
# from Chia/app/
uvicorn main:app --reload          # docs at http://127.0.0.1:8000/docs
```
Needs `app/.env` (gitignored — see §10). Imports are bare (`from core...`), so run it **from
`app/`** as a self-contained package.

```bash
# migrations (from Chia/):
alembic -c app/alembic.ini upgrade head
# or, from Chia/app/:
alembic upgrade head
```

### Frontend (`frontend/`)
```bash
# from Chia/frontend/
npm install
npm run dev                        # http://localhost:3000
```

---

## 9. Deploy

### Render (backend)
- **Branch** `backend` · **Root Directory** *(empty)*
- **Build** `pip install -r requirements.txt`
- **Start** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Pre-Deploy** `alembic upgrade head`
- Live: https://chia-rne5.onrender.com

### Vercel (frontend)
- **Production Branch** `main` · **Root Directory** *(empty)* · Next.js auto-detected
- Live: https://chia-nutrition.vercel.app
- **Shipping a frontend change:** develop on `frontend`, then **merge into `main`** so Vercel
  rebuilds (the `main` branch mirrors the frontend at its root).

---

## 10. Environment variables

### Backend (Render env / `app/.env`)
| Key | Notes |
|-----|-------|
| `DATABASE_URL` | Supabase **Session pooler** URI (`postgresql://postgres.<ref>:<pw>@aws-…pooler.supabase.com:5432/postgres`). **URL-encode special chars in the password** (`@` → `%40`). The direct `db.<ref>.supabase.co` host is IPv6-only and unreachable from Render. |
| `GROQ_API_KEY` | Groq key for the swap + insights agents. |
| `SECRET_KEY` | JWT signing secret (set a strong value in prod). |

### Frontend
| Key | Notes |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | Backend base URL. `frontend/.env.production` = Render URL; `.env.local` = `http://localhost:8000`. |

---

## 11. Notes & gotchas (read before debugging)

- **Stale `.env` keys:** Firebase / Gemini entries in `app/.env` are dead weight — `config.py` sets
  `extra="ignore"`. The app runs on **Groq**. Don't let them mislead you.
- **Supabase + Render:** always use the **Session pooler** (IPv4). The direct connection fails with
  `Network is unreachable`.
- **CORS:** backend allows `localhost:3000`, the prod Vercel domain, and `*.vercel.app` previews
  (regex in `app/main.py`). Add new frontend domains there.
- **Auth on the client:** only the **token** is persisted (`store/auth.ts`); the user object is
  re-fetched from `/users/me` on load. A 401 anywhere triggers auto-logout in `apiFetch`.
- **Day boundaries are UTC** (streaks + weekly insights). Fine for MVP; revisit for timezones.
- **AI never produces numbers.** Stats are SQL; the model only writes prose. Keep it that way.
- **Secrets:** all `.env*` are gitignored except `frontend/.env.production` (public API URL only).
  Never commit DB passwords or API keys.
```
