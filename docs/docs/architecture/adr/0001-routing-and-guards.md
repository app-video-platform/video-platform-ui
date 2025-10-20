# ADR 0001: Routing and Role Guards
Date: 2025-10-20
Status: Accepted

## Context
We use React Router v6 with a layout shell at `/app` and role-based access.

## Decision
- Keep top-level public routes under `/`
- App shell at `/app` with `ProtectedRoute` role checks
- Role-based index component resolution on `/app`

## Consequences
+ Clear separation of public vs app routes
- Must update docs + route map on changes



> Owner: @aleb, el Hijo del Diablo · Last reviewed: 2025-10-20
