# Chia — Product Requirements Document (PRD)

## Overview

Chia is a web app that suggests **healthier alternatives** to the food a user
craves. The user tells the app what they want to eat, and Chia suggests a
healthier swap with a reason and alternatives.

We are building the **backend first**, page by page. Once the backend for all
pages is done, we move to the frontend.

---

## Pages (5)

1. **AI Chatbot** — the core swap engine; user says a craving, gets a healthier alternative.
2. **Journaling / Food Logs** — records cravings, swaps taken, and mood.
3. **Streaks** — tracks daily logging streaks.
4. **Weekly Insights** — weekly summary of swaps, top cravings, and tips.
5. **Profile Settings** — user name, goal, diet preference, reminder time.

> Build order: backend for each page one by one, then frontend.

---

## Tech Stack

| Purpose          | Use           |
| ---------------- | ------------- |
| AI wrapper       | PydanticAI    |
| Backend          | FastAPI       |
| DB ORM           | SQLAlchemy    |
| Auth             | FastAPI Users |
| State management | Zustand       |
| Charts           | Recharts      |

### Core Backend Architecture (simple)

- **Framework:** FastAPI (Python) — better for AI + future ML than Node.js.
- **Database:** PostgreSQL via **Supabase** (hosted, no local install).
- **DB style:** Async SQLAlchemy + `asyncpg`.

---

## Project Structure (Backend)

Modular layout — one folder per concern, one file per feature so it maps
directly to the 5 pages / modules. Separation: **models** (DB tables) ≠
**schemas** (API shapes) ≠ **services** (business logic) ≠ **api** (routes).

```
Chia/
├── app/
│   ├── main.py              # FastAPI app entry, router registration, /health
│   ├── core/
│   │   ├── config.py        # settings (env vars, DB URL, secrets)
│   │   └── database.py      # async SQLAlchemy engine + session
│   ├── models/              # SQLAlchemy ORM tables
│   │   ├── user.py
│   │   ├── journal.py
│   │   ├── swap.py
│   │   └── streak.py
│   ├── schemas/             # Pydantic request/response models
│   ├── api/                 # route handlers (one file per module)
│   │   ├── auth.py
│   │   ├── profile.py
│   │   ├── swap.py
│   │   ├── journal.py
│   │   ├── streak.py
│   │   └── insights.py
│   ├── services/            # business logic (swap engine, streak logic)
│   └── users.py             # FastAPI Users setup
├── .env                     # secrets / DB connection string (gitignored)
├── .env.example             # template without secrets
├── .gitignore
├── requirements.txt
└── README.md
```

### Build order
Scaffold first (config, database, `main.py` + `/health`), then add modules
one at a time: **Auth → Profile → Swap → Journal → Streak → Insights**.

---

## Core Modules

### 1. Auth (basic for MVP)
- User signup
- Login
- `user_id` generation (JWT or Firebase auth)
- Email + password **or** Google login

### 2. User Profile Service
Stores:
- `user_id`
- `name`
- `goal` (lose weight / healthy eating)
- `diet_preference` (veg / non-veg)
- `reminder_time`

### 3. Chat / Swap Engine (CORE FEATURE 🔥)
The AI brain of the app.

**Endpoint:** `POST /swap`

**Input:**
```json
{
  "user_id": "123",
  "craving": "chips"
}
```

**Output:**
```json
{
  "swap": "roasted makhana",
  "reason": "lower oil, similar crunch",
  "alternatives": ["popcorn", "nuts"]
}
```

Implementation path:
- **Rule-based first** (fast MVP)
- Later upgraded to **LLM** (Gemini / OpenAI)

### 4. Journal Service
**Endpoint:** `POST /journal`

Stores:
- `user_id`
- `original_craving`
- `swap_taken`
- `timestamp`
- `mood` (optional)

### 5. Streak Engine 🔥
Logic:
- If user logs journal today → streak +1
- If a day is missed → reset or pause

**Endpoint:** `GET /streak/:user_id`

**Returns:**
```json
{
  "current_streak": 5,
  "best_streak": 12
}
```

### 6. Insights Engine (weekly summary)
**Endpoint:** `GET /insights/weekly/:user_id`

Computes:
- Total swaps
- Most common craving
- Healthy vs unhealthy ratio

**Output:**
```json
{
  "summary": "Great week!",
  "total_swaps": 14,
  "top_craving": "snacks",
  "improvement_tip": "Try replacing evening snacks with fruits"
}
```

### 7. Reminder System (optional but powerful)
- Store reminder time
- Later use a cron job / scheduler

---

## Database Tables

### users
- `id`
- `name`
- `email`
- `goal`
- `diet_type`

### swaps (optional log)
- `id`
- `user_id`
- `craving`
- `swap_suggested`
- `timestamp`

### journal
- `id`
- `user_id`
- `craving`
- `swap_taken`
- `mood`
- `date`

### streaks
- `user_id`
- `current_streak`
- `last_active_date`

---

## API List (final checklist)

### Auth
- `POST /signup`
- `POST /login`

### Swap
- `POST /swap`

### Journal
- `POST /journal`
- `GET /journal/:user_id`

### Streak
- `GET /streak/:user_id`

### Insights
- `GET /insights/weekly/:user_id`

---

# Frontend (Phase 2)

Next.js web app in the `frontend/` subfolder. A "typical web app": marketing
landing page → signup → onboarding → the 5-page app with sidebar navigation.

## Stack
| Purpose | Use |
| --- | --- |
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| UI components | shadcn/ui |
| Global state (auth/session) | Zustand |
| Server data (fetch/cache) | TanStack Query |
| Charts | Recharts |

**Auth:** JWT stored in localStorage → loaded into Zustand → sent as
`Authorization: Bearer <token>` via a `lib/api.ts` fetch wrapper.

## Design system (theme from the chia-seed logo + Nutrola-style layout)
- Reference: clean modern layout (like nutrola.app) + warm, friendly logo palette.
- Palette: cream `#FAF6EF` background · cocoa brown `#7A4A28` brand ·
  **sprout green `#5B8C51` accent** (CTAs, charts, streaks) · white cards ·
  dark cocoa `#2B2018` text · tan borders `#E5D8C5`.
- Type: Poppins/Nunito (playful rounded) for headings, Inter for body.
- Shape/feel: rounded-2xl, soft shadows, subtle polka-dot motif, mascot reused
  throughout (hero, onboarding, empty states, loading).

## Routes
```
PUBLIC
  /                 Marketing landing page
  /login  /signup   Auth
AUTH (profile incomplete)
  /onboarding       Multi-step wizard → collects goal/diet/reminder
APP (sidebar layout)
  /app/chat         1. AI Coach (craving → swap, chat-style)
  /app/journal      2. Food logs
  /app/streaks      3. Streaks
  /app/insights     4. Weekly insights (Recharts)
  /app/profile      5. Profile settings
```
**Onboarding gate:** if `goal`/`diet_type` are null → redirect to `/onboarding`
(inferred from the profile; no backend flag).

## Marketing landing sections (Nutrola-inspired)
Navbar → Hero (headline + CTA + mascot) → How it works (3 steps) → Features
(alternating blocks) → "Old way vs Chia" comparison → Testimonials → CTA + footer.

## Onboarding wizard
Welcome+name → Goal → Diet → Reminder time → `PATCH /users/me` → `/app/chat`.

## Build order
1. Scaffold + design system (theme, fonts, shadcn, providers, `lib/api.ts`, CORS on backend)
2. Marketing landing page
3. Auth (login/signup)
4. Onboarding wizard
5. App shell + sidebar
6. Pages one by one: AI Coach → Journal → Streaks → Insights → Profile

## Required backend change
Add `CORSMiddleware` to `app/main.py` to allow the frontend origin
(`http://localhost:3000`).
