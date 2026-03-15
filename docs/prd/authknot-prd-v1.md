# AuthKnot PRD — v1 Foundation

> Trust infrastructure for AI agents.

See the full PRD for detailed requirements across all domains:
identity, trust profiles, policy, event ingestion, trust engine,
graph intelligence, action engine, evidence/audit, operator console,
and public trust profile.

## Phase 0 — Foundation (current)

- Monorepo with devcontainer
- CI pipeline
- Backend scaffold (FastAPI + SQLAlchemy + Alembic)
- Frontend scaffold (React + TypeScript + shadcn/ui + TanStack Query)
- Auth and tenant model
- Basic agent registry API
- Cursor rules for dev conventions

## Phase 1 — Core Loop

- Agent registration + trust profile
- Event ingestion
- Rules-based policy engine
- Observe-only mode
- Audit trail
- Basic operator console views

## Phase 2–4

See PRD sections 21.2–21.4 for production pilot, controlled enforcement,
and graph-native differentiation milestones.
