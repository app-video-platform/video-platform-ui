---
sidebar_position: 3
title: Routing Map
---

This page lists major routes and what they do. Start with a small table and grow it.

| Route | Access | Roles | Notes |
|---|---|---|---|
| `/` | public | — |  |
| `/` | public | — | Index |
| `/*` | public | — | NotFoundPage |
| `/about` | public | — |  |
| `/app` | public | — |  |
| `/app` | protected | Admin, Creator, User | Index · Role-based landing: Creator→CreatorDashboard, Admin→AdminPage, else GalacticaHome |
| `/app/*` | protected | — | Redirects to /app |
| `/app/cart` | protected | Admin, Creator, User |  |
| `/app/explore` | public | — |  |
| `/app/explore/search` | public | — |  |
| `/app/library` | protected | User, Admin |  |
| `/app/library/all-products` | protected | User, Admin |  |
| `/app/library/my-consultation` | protected | User, Admin |  |
| `/app/library/my-courses` | protected | User, Admin |  |
| `/app/library/my-download-packages` | protected | User, Admin |  |
| `/app/library/my-wishlist` | protected | User, Admin |  |
| `/app/marketing` | protected | Creator, Admin |  |
| `/app/my-page-preview` | protected | Admin, Creator, User |  |
| `/app/product/:id/:type` | public | — |  |
| `/app/products` | protected | Creator, Admin |  |
| `/app/products` | protected | Creator, Admin | Index |
| `/app/products/create` | protected | Creator, Admin |  |
| `/app/products/edit/:type/:id` | protected | Creator, Admin |  |
| `/app/sales` | protected | Creator, Admin |  |
| `/app/settings` | protected | Admin, Creator, User |  |
| `/app/store/:creatorId` | public | — |  |
| `/contact` | public | — |  |
| `/dev-dashboard` | public | — |  |
| `/email-sent` | public | — |  |
| `/forgot-password` | public | — |  |
| `/login` | public | — |  |
| `/onboarding` | protected | Admin, Creator, User |  |
| `/pricing` | public | — |  |
| `/signup` | public | — |  |
| `/unauthorized` | public | — |  |
| `/verify-email` | public | — |  |


> Later, we’ll replace this with an auto-generated list.
> Owner: @aleb, el Hijo del Diablo · Last reviewed: 2025-10-20
