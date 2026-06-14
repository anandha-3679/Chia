# Chia 🌱

A full-stack nutrition coach app — log cravings, get healthier "swap" suggestions powered by an LLM, track journals and streaks, and view weekly insights.

- **Frontend:** Next.js 16 (React 19, Tailwind, shadcn, Zustand, TanStack Query)
- **Backend:** FastAPI (async SQLAlchemy + asyncpg), FastAPI Users (JWT auth)
- **Database:** Supabase Postgres (via the Session pooler)
- **AI:** Groq (Llama 3.1 8B Instant) for the swap engine
- **Deploy:** Backend on Render, Frontend on Vercel

---

## Repository layout

This project lives in **one GitHub repo (`anandha-3679/Chia`) split across three branches**, each rooted at a different folder on disk:

| Local folder | Git branch | Deploys to | Contents |
|--------------|-----------|------------|----------|
| `app/`       | `backend` | Render     | FastAPI service + Alembic migrations |
| `frontend/`  | `frontend`| —          | Next.js app (source of truth) |
| `Chia/` (root) | `main`  | Vercel     | Frontend at root (merged from `frontend`) + `prd.md`, `chia-logo.png` |

> Each folder (`app/`, `frontend/`) is its **own git repository** with its own remote pointing at the same GitHub repo. The root `Chia/` folder is a separate repo whose `main` branch carries the frontend at its root so Vercel can build from the repo root.

```
Chia/
├── app/            # backend repo  -> branch: backend
│   ├── main.py
│   ├── api/  core/  models/  schemas/  services/
│   ├── users.py
│   ├── migrations/ alembic.ini
│   └── requirements.txt
├── frontend/       # frontend repo -> branch: frontend
│   ├── app/ components/ lib/ hooks/ store/ types/
│   └── package.json
├── prd.md
├── chia-logo.png
└── README.md       # (this file - local only)
```

---

## Backend (`app/`)

### Run locally
```bash
# from Chia/app/  (the backend repo root)
uvicorn main:app --reload
```
- Requires a `.env` in `app/` (gitignored). See **Environment variables** below.
- Imports are bare (`from core...`, `from models...`) — the service is a self-contained package, run with `uvicorn main:app`.
- Docs at http://127.0.0.1:8000/docs

### Migrations (Alembic)
```bash
# from Chia/ (parent):
alembic -c app/alembic.ini upgrade head
# or, from Chia/app/:
alembic upgrade head
```

### Render settings
- **Branch:** `backend`  ·  **Root Directory:** *(empty)*
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Pre-Deploy Command:** `alembic upgrade head`
- Live URL: https://chia-rne5.onrender.com

---

## Frontend (`frontend/`)

### Run locally
```bash
# from Chia/frontend/
npm install
npm run dev          # http://localhost:3000
```

### Vercel settings
- **Production Branch:** `main`  ·  **Root Directory:** *(empty)*
- Framework auto-detected (Next.js). Default build/install commands.
- Live URL: https://chia-nutrition.vercel.app

### Deploying frontend changes
Develop on the `frontend` branch, then merge it into `main` so Vercel rebuilds (the `main` branch mirrors the frontend at its root).

---

## Environment variables

### Backend (Render env vars / `app/.env` locally)
| Key | Notes |
|-----|-------|
| `DATABASE_URL` | Supabase **Session pooler** URI (`postgresql://postgres.<ref>:<pw>@aws-…pooler.supabase.com:5432/postgres`). **URL-encode special chars in the password** (`@` -> `%40`). The direct `db.<ref>.supabase.co` host is IPv6-only and unreachable from Render. |
| `GROQ_API_KEY` | Groq API key for the swap engine |
| `SECRET_KEY` | JWT signing secret (set a strong value in production) |

### Frontend
| Key | Notes |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | Backend base URL. Committed in `frontend/.env.production` (= Render URL); `.env.local` holds `http://localhost:8000` for dev. |

---

## Notes & gotchas

- **CORS:** the backend allows `localhost:3000`, the production Vercel domain, and `*.vercel.app` previews (see `app/main.py`). Add new frontend domains there.
- **Supabase + Render:** always use the **Session pooler** (IPv4); the direct connection fails with `Network is unreachable`.
- **Secrets:** `.env*` files are gitignored (except `frontend/.env.production`, which holds only the public API URL). Never commit DB passwords or API keys.
