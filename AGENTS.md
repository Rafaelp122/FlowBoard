# FlowBoard — Agent Instructions

## Project status

Scaffolded. Backend (FastAPI + uv), frontend (Vite + React + shadcn), Docker Compose, CI/CD, and docs are in place. Ready for Fatia 1 implementation.

## Architecture

- **Feature-based** for both backend and frontend. Each feature gets its own folder with models, schemas, service, and router (backend) or api, hooks, components (frontend). See conversation history for full tree.
- **Backend root:** `backend/app/`. Features at `app/{auth,boards,cards,members,comments,activity,ws}/`. Shared at `app/core/`.
- **Frontend root:** `frontend/src/`. Features at `src/features/{auth,boards,cards,...}/`. Shared at `src/shared/`.

## Development workflow

- Work in **vertical slices** (see `docs/SLICES.md`). Never skip ahead.
- **Fatia 1** is the starting point: US01–US05 (auth + boards + columns).
- User stories live at `docs/USER_STORIES.md` — that is the single source of truth for functional requirements. There is no REQUIREMENTS.md.
- Definition of Done is at the bottom of `docs/USER_STORIES.md`. Every story must pass those gates before being considered done.
- **TDD mandatory:** every issue/slice starts with tests. Write failing tests first, then implementation, then refactor. Never write implementation before tests.

### Test layers per story

Every user story must include all applicable layers before being considered done:

| Layer | Backend | Frontend |
|-------|---------|----------|
| Unit | pytest + factory_boy (services, repositories) | Vitest + RTL (components, hooks) |
| Integration | httpx.AsyncClient (router endpoints) | Vitest + vi.mock (API hooks) |
| E2E | — | Playwright (Fatia 2+, user flows only) |

## Stack constraints

- **Backend:** FastAPI async-only. SQLAlchemy 2.0 `Mapped[]` style. PostgreSQL via asyncpg. JWT via python-jose + passlib[bcrypt]. Alembic for migrations.
- **Frontend:** React 18+ with Vite. shadcn/ui for components. Tailwind CSS v4. TanStack Query v5 for server state. Zustand for UI state. @dnd-kit for drag-and-drop (Fatia 2+). Orval for API contract — generates typed React Query hooks from OpenAPI spec. No manual `api.ts` files.
- **Real-time (Fatia 3+):** WebSockets nativos do FastAPI, agrupados por `board_id`. Features `cards/`, `comments/`, etc. não devem implementar WS até a Fatia 3 — usar apenas REST nas Fatias 1 e 2.

## Installed skills

Skills are at `.agents/skills/`. Load them for patterns and conventions:

| Skill | Use for |
|-------|---------|
| `fastapi` | Idiomatic FastAPI code (official) |
| `fastapi-templates` | Project structure, DI, async patterns |
| `sqlalchemy-orm` | Models, queries, async sessions, Alembic, repository pattern |
| `vercel-react-best-practices` | React components, hooks, patterns |
| `vercel-composition-patterns` | Component hierarchy (board → columns → cards) |
| `shadcn` | UI component installation and usage |

## Backend patterns

- **Repository pattern:** every feature uses a repository layer between service and database. Prefer `BaseRepository[Model]` (generic CRUD) from `app/core/repositories.py`. Only create feature-specific repositories (`BoardRepository`, `CardRepository`) when custom queries are needed beyond CRUD.
- **Dependency injection chain:** `router → Depends(service) → Depends(repository) → Depends(get_db)`. Services receive repositories; repositories receive sessions. Never inject `AsyncSession` directly into services or routers.
- Use `async_sessionmaker` for the session factory — do not create sessions manually.

## Testing

### Backend

- **Framework:** pytest with `pytest-asyncio`.
- **Factories:** use `factory_boy` for test data. Define one factory per model (e.g., `UserFactory`, `BoardFactory`). Factories live in `tests/factories/`.
- **Database:** tests use in-memory SQLite (`sqlite+aiosqlite://`) with `StaticPool`. Override `get_db` dependency via `app.dependency_overrides`.
- **Coverage target:** every endpoint must have at least a happy-path test. Error paths and edge cases tested for auth and critical flows.

### Frontend

- **Unit/component tests:** Vitest (ecossistema Vite, zero config).
- **E2E tests (Fatia 2+):** Playwright for drag-and-drop and WebSocket flows.

## ADRs

Architecture decisions are at `docs/ADR/`. Consult when a decision is questioned — write new ones only when a non-trivial choice is actually made during development.
