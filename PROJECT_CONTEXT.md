# PROJECT_CONTEXT.md

Generated from repository state:

Branch: main
Commit: b9f5510

Last reviewed: 2026-08-07

# How to use this document

This document is intended to bootstrap a new Codex context.

Read this document after `AGENTS.md`.

Treat the current codebase as the source of truth if any information here conflicts with the implementation.

This document contains project context, historical architectural decisions, domain terminology, and ongoing work. It should be updated whenever significant architectural decisions are made.

## Product Overview

This frontend is for a creator commerce/learning platform. Creators/admins create and manage products; users browse, buy/save products, and access a library. Public marketing pages explain the platform.

Main roles are defined in `src/core/api/models/user/user.ts`:

- `ADMIN`: platform admin; role home is the admin dashboard.
- `CREATOR`: creator/seller; role home is the creator dashboard.
- `USER`: buyer/consumer; role home is Galactica home.

Role precedence is `ADMIN > CREATOR > USER` in `role-utils.ts`.

Important product types:

- `COURSE`: sections with lessons.
- `DOWNLOAD`: sections with downloadable files.
- `CONSULTATION`: appointment/session details instead of sections.

## Architecture Summary

The app uses React 18, TypeScript, React Router v6, Redux Toolkit, Axios, SCSS, Jest/Testing Library, Storybook, Tiptap, Uppy, and custom Webpack/Babel config.

Routing starts in `src/App.tsx`:

- `/app/*`: app domain via `AppRouter`.
- `/onboarding`: protected onboarding through `AppRouter`.
- `/auth/*`: auth domain.
- `/*`: marketing domain.
- legacy auth aliases redirect to `/auth/...`.

State is centralized in `src/core/store/store.ts` with slices for auth, admin, products, notifications, cart, wishlist, and reviews. Product listener middleware creates notifications after product/section/lesson actions. Cart is currently persisted to localStorage.

API services live under `src/core/api/services`; DTO/model types live under `src/core/api/models`. `http-client.ts` configures Axios with `REACT_APP_BASE_PATH`, credentials, CSRF injection, refresh-token retry, and optional local mocks when `REACT_APP_USE_MOCKS=true`.

## Product Builder

The builder is centered on:

- `src/domains/app/pages/creator-specific/products/product-form/product-form.component.tsx`
- `src/domains/app/features/product-form/hooks/use-product-form.facade.ts`
- `src/domains/app/features/product-form/models/product-form.ts`

Flow:

1. `CreateProductStepOne` creates a backend `DRAFT` product with `name`, `type`, `userId`, and `status`.
2. The rest of the builder appears after a product ID exists.
3. `BuilderSidebar` chooses tabs by product type.
4. `COURSE` and `DOWNLOAD` use sections.
5. `CONSULTATION` uses consultation details.
6. Product details autosave separately from section, lesson, and download-file updates.

Intentional model decisions:

- Product union types live in `src/core/api/models/product`.
- `AbstractProduct` is a discriminated union of course/download/consultation.
- `ProductDraft` allows incomplete frontend state before backend persistence.
- `mapFormDataToProductPayload` maps drafts to backend payloads and keeps unsupported product types explicit.
- Product normalizers handle backend `details` payload shape for sections and consultation details.

## Current Feature State

Implemented / reasonably wired:

- Auth signup, login, verify email, forgot password, Google sign-in hooks.
- Protected routes by role.
- Creator product list with local filters/sorting.
- Product create/edit builder for course/download/consultation basics.
- Course/download section creation, autosave, deletion.
- Course lesson creation, autosave, deletion for `VIDEO`, `ARTICLE`, `QUIZ`; assignment is placeholder.
- Download section file upload via presigned URL + confirm upload.
- Admin users page: search/filter users and update single role.
- Admin products page: search/filter products, delete products, edit/view, create product for selected creator.
- Admin audit page: list/filter audit logs.
- Marketing pages and shared marketing layout.
- Storybook setup for shared/components.

Partially implemented / placeholder:

- Product detail page has real loading by product ID but still contains placeholder copy, fake rating/language/duration/creator text, and placeholder image.
- Storefront page fetches creator products but currently renders mostly empty UI.
- Creator dashboard has placeholder audience/sales sections and hardcoded “member since”.
- Cart/wishlist exist mostly frontend-side/localStorage; persistence/checkout contract is not clearly backend-backed.
- Lesson content persistence for uploaded videos/rich text/quiz data may need backend contract verification.
- Assignment lesson editor is a visible placeholder.
- Rich text editor embed support has a TODO.
- `README.md` is partly stale starter documentation.

## Known Technical Debt / Risks

Confirmed:

- `src/core/providers/app-initializer.util.tsx` navigates to `dashboard` on profile load, while current app routing is organized around `/app` and role-based app index.
- Tests pass but emit React Router v7 future flag warnings.
- Tests emit icon casing warnings because icon mocks render as unknown tags in some shared UI tests.
- Some shared UI tests emit controlled-input warnings.
- `src/domains/app/pages/storefront-page/storefront-page.component.tsx` has unused fetched state in the rendered UI.
- `.github/workflows/docs.yml` expects a `docs/` directory, but no `docs/` directory exists in this checkout.
- `src/core/store/shop-cart/shop-cart.slice.ts` removal has a likely index bug: index `0` is treated as false, so the first cart item may not remove.

Deliberate temporary implementations:

- `REACT_APP_USE_MOCKS` can load ignored local `src/core/api/_mocks.ts`.
- Blank section/lesson drafts exist locally until enough data is present for backend creation.
- Download upload deduping is local to the section editor instance.

Speculative / verify before changing:

- Backend shape for lesson rich text, quiz payloads, video upload, checkout/cart, and storefront data.
- Whether product type changes after creation should remain disallowed in edit mode; current UI limits edit mode to current type in `BasicInfo`.

## Recent / Unfinished Work

Recent Git history centers on admin role/product ownership work:

- Admin role management UI and role-based routing.
- Dev role switcher/backend role change support.
- Admin product management and create-for-creator flow using `ownerId` query param.

Likely next steps:

- Polish/fix admin product owner filtering UX beyond raw owner ID.
- Complete product detail and storefront UI using real backend fields.
- Fix known warnings and cart removal bug.
- Verify product builder contracts for lesson content, quiz persistence, media upload, and consultation scheduling.
