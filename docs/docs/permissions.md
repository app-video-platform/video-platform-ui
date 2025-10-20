---
title: Permissions & Guards
sidebar_position: 7
---

Roles: `Admin`, `Creator`, `User`, (Visitor = unauthenticated)

| Capability / Route | Visitor | User | Creator | Admin |
|---|---|---|---|---|
| `/` Home & static pages | ✅ | ✅ | ✅ | ✅ |
| `/signup`, `/login` | ✅ | ✅ | ✅ | ✅ |
| `/onboarding` | ❌ | ✅ | ✅ | ✅ |
| `/app` (index: role-based) | ❌ | ✅ | ✅ | ✅ |
| `/app/explore`, `/app/store/:creatorId`, `/app/product/:id/:type` | ✅ | ✅ | ✅ | ✅ |
| `/app/products/*` | ❌ | ❌ | ✅ | ✅ |
| `/app/sales`, `/app/marketing` | ❌ | ❌ | ✅ | ✅ |
| `/app/library/*` | ❌ | ✅ | ❌ | ✅ |
| `/app/settings`, `/app/cart`, `/app/my-page-preview` | ❌ | ✅ | ✅ | ✅ |

Notes:
- Protected routes enforced via `<ProtectedRoute allowedRoles=[...] />`.
- `/app` index resolves to `CreatorDashboard` (Creator), `AdminPage` (Admin), else `GalacticaHome`.


> Owner: @aleb, el Hijo del Diablo · Last reviewed: 2025-10-20
