# PROJECT_CONTEXT.md

Generated from repository state:

Branch: main
Commit: b9f5510

Last reviewed: 2026-08-12

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

- `COURSE`: section-based product with lessons.
- `DOWNLOAD`: section-based product with downloadable files.
- `CONSULTATION`: appointment/session details instead of sections.
- `MEMBERSHIP`: shared Product with a Membership-specific builder path. Product owns the generic shell and recurring pricing metadata; Membership owns content, included-product associations, and feed configuration through Product-scoped contracts.

## Architecture Summary

The app uses React 18, TypeScript, React Router v6, Redux Toolkit, Axios, SCSS, Jest/Testing Library, Storybook, Tiptap, Uppy, Recharts for chart rendering, and custom Webpack/Babel config.

Routing starts in `src/App.tsx`:

- `/app/*`: app domain via `AppRouter`.
- `/onboarding`: protected onboarding through `AppRouter`.
- `/auth/*`: auth domain.
- `/*`: marketing domain.
- legacy auth aliases redirect to `/auth/...`.

State is centralized in `src/core/store/store.ts` with slices for auth, admin, products, membership, notifications, cart, wishlist, and reviews. Product listener middleware creates notifications after product/section/lesson actions. Cart is currently persisted to localStorage.

API services live under `src/core/api/services`; DTO/model types live under `src/core/api/models`. `http-client.ts` configures Axios with `REACT_APP_BASE_PATH`, credentials, CSRF injection, refresh-token retry, and optional local mocks when `REACT_APP_USE_MOCKS=true`.

## Authenticated Creator Management Architecture

Creator/Admin management routes are visually and structurally separated from buyer/marketplace routes in `src/domains/app/pages/app-layout/app-layout.component.tsx`.

- `CreatorAppShell` lives in `src/domains/app/layouts/creator-app-shell/creator-app-shell.component.tsx`.
- Creator navigation is rendered by `SidebarNav` in `src/domains/app/widgets/sidebar-nav/sidebar-nav.component.tsx` using `appRoutes` from `src/core/constants/routes.ts`.
- Desktop Creator management uses a persistent collapsible sidebar and does not render the marketplace/shared `TopNavbar`.
- Creator account controls live in the bottom/footer of the Creator sidebar. The footer reuses `UserDropdown`; account, logout, and dev-role behavior must not be duplicated in sidebar code.
- Expanded sidebar account footer shows the user avatar, display name, primary role label, and dropdown affordance. Collapsed/compact sidebar shows an avatar-only account trigger with an accessible label/title.
- Tablet/mobile Creator management retains the compact top bar with drawer navigation and the existing account dropdown trigger in that mobile top bar.
- Product Overview routes (`/app/products/:productId`) render inside `CreatorAppShell` as Creator/Admin management inspection pages for individual Products.
- Product Landing Page Builder routes (`/app/products/:productId/landing-page`) render inside `CreatorAppShell` and use route metadata to request sidebar collapse, matching the focused live-editing feel of Storefront Builder while remaining in Creator management IA.
- Product builder routes (`/app/products/create`, `/app/products/edit/*`, and `/app/admin/products/create`) intentionally render outside `CreatorAppShell` so editing can use a focused product workspace.
- Routes can request the Creator sidebar collapse through `collapseSidebarOnLoad` route metadata. Product edit routes and the Storefront Builder use this existing shell/sidebar behavior.
- Marketplace/customer routes such as `/app/explore` still use the older `TopNavbar` shell; the marketplace Explore/Search experience is not part of the Creator management IA. The public Storefront route intentionally bypasses both Creator management chrome and the older marketplace chrome.

Current Creator IA:

- Functional management destinations: Dashboard (`/app`), Products (`/app/products`), Customers (`/app/customers`), Sales (`/app/sales`), Analytics (`/app/analytics`), Storefront (`/app/storefront`), Settings (`/app/settings`).
- Intentionally disabled sidebar destinations: Help (`/app/help`).
- Admin appears as a utility route for admin users only.
- Marketing, Messages, and Reviews are not part of the current Creator MVP navigation. Reviews code still exists under marketing/reviews services/features, but it is not exposed as a Creator IA destination.
- Legacy `/app/my-page-preview` redirects to `/app/storefront`; do not treat it as the active Storefront implementation.

## Creator Visual Conventions

The current Creator redesign establishes a dark management application language, not a marketing-page treatment.

- App canvas and surfaces are defined in `src/styles/_variables.scss` with dark navy surface tokens (`--surface-canvas`, `--surface-panel`, `--surface-panel-elevated`) and semantic aliases (`--surface-0`, `--surface-1`, `--surface-2`).
- Primary Creator actions use restrained warm gold (`--brand-primary`); violet (`--brand-secondary`) is a supporting interaction/brand atmosphere rather than the default action color.
- Semantic colors (`--success`, `--error`, `--warning`, `--info`) should remain functional, especially for status badges, validation, and alerts.
- RGB channel tokens (`--brand-primary-rgb`, `--brand-secondary-rgb`, `--success-rgb`, `--error-rgb`, surface RGB tokens) exist for safe alpha composition.
- Spacing, radius, transitions, and breakpoints are centralized in `src/styles/_spacing.scss`, `_radius.scss`, `_transitions.scss`, and `_breakpoints.scss`. Current breakpoints include mobile, tablet, laptop, desktop, and wide.
- Management UI should prefer surface hierarchy, spacing, and restrained borders over heavy shadows or decorative card stacking.
- Body/management typography uses the body font. `Bebas Neue` is available as `$font-heading` and should stay selective for display/brand moments such as the shell brand, not ordinary management headings.

Shared interaction conventions now include semantic `Button` variants/sizes in `src/shared/ui/button`, accessible loading state via `aria-busy`/disabled behavior, calmer hover/focus/active states, and Escape-to-close dropdown behavior in `src/shared/ui/dropdown/dropdown.component.tsx`. The old global animated growing link underline has been removed from application interactions; unclassed prose links now use a simple underline treatment in `src/styles/_base.scss`. Do not assume every legacy UI has been migrated.

Shared status presentation now has a reusable `StatusBadge` in `src/shared/ui/status-badge`. `StatusBadge` owns semantic badge presentation (`success`, `warning`, `danger`, `neutral`, `info`), visible labels, optional icons, and sizing. Feature/domain code remains responsible for deciding which business status maps to which semantic tone. Do not accumulate feature-specific status rules inside the shared primitive. The older `StatusChip` can compose `StatusBadge` where useful, but not every status surface has been migrated.

Shared contextual drawer behavior now lives in `src/shared/ui/drawer`. The shared `Drawer` owns generic interaction/presentation behavior such as overlay rendering, ARIA dialog semantics, Escape-to-close, focus handling/restoration, body scroll locking, scrollable body content, and responsive mobile full-screen treatment. Feature components own drawer content and business behavior. As a convention, use a Page for a substantial destination/workspace with its own navigation depth, a Drawer for contextual inspection or interaction while retaining the parent workspace, and a Modal/Dialog for short focused tasks or confirmations that temporarily interrupt the workflow. Treat this as a convention, not an absolute rule.

Shared chart presentation now lives in `src/shared/ui/chart`. Recharts is the chosen rendering library for current analytics visualizations. Shared chart primitives own generic presentation and accessibility scaffolding such as chart containers, legends, tooltips, empty states, CSS-driven height, and visual token usage. Domain pages own business semantics, period choices, metric definitions, summary copy, and data shaping. Chart colors should use the global visualization tokens in `src/styles/_variables.scss` (`--chart-grid`, `--chart-tick`, `--chart-series-*`, tooltip tokens, and related RGB tokens) rather than hardcoded feature-local palettes. Analytics visualizations should preserve responsive containers, readable axis density at narrow widths, semantic labels/descriptions, Recharts accessibility layers where supported, and text summaries outside SVG/canvas visuals for screen-reader and low-vision access.

## Product Builder

The builder is centered on:

- `src/domains/app/pages/creator-specific/products/product-form/product-form.component.tsx`
- `src/domains/app/features/product-form/hooks/use-product-form.facade.ts`
- `src/domains/app/features/product-form/models/product-form.ts`
- `src/domains/app/layouts/product-workspace-shell/product-workspace-shell.component.tsx`

Flow:

1. `CreateProductStepOne` creates a backend `DRAFT` product with `name`, `type`, `userId`, and `status`.
2. The rest of the builder appears after a product ID exists.
3. `ProductWorkspaceShell` provides the focused editing shell. The normal Creator sidebar is removed while editing, and the workspace header provides Back to Products, product type/title/status, autosave status, disabled Preview/overflow placeholders, and Publish state.
4. `BuilderSidebar` chooses internal workspace navigation by product type.
5. `COURSE` and `DOWNLOAD` use sections.
6. `CONSULTATION` uses consultation details.
7. `MEMBERSHIP` uses the shared builder shell with a Membership Content tab and recurring-pricing UI in the Pricing tab.
8. Product details autosave separately from section, lesson, download-file, and Membership-domain updates. Membership recurring pricing is Product-owned and uses the generic Product payload.

Product workspace terminology:

- Shared tabs: Basics, Pricing, Media.
- Course section tab: Curriculum.
- Download section tab: Files.
- Consultation tab: Availability.
- Membership tab: Content.

Individual product types share `ProductWorkspaceShell`, while their domain-specific editors remain separate inside `src/domains/app/features/product-form`.

## Product Overview V1

Creator/Admin Product Overview is the management home for one Product. Route separation is intentional:

- Product Overview: `/app/products/:productId`.
- Focused Product Workspace: `/app/products/edit/:id`.
- Legacy/type-bearing Product Workspace path: `/app/products/edit/:type/:id`.
- Public Product Landing Page: `/app/product/:id` and compatibility path `/app/product/:id/:type`.

Product Overview lives under `src/domains/app/pages/creator-specific/products/product-overview`, renders inside `CreatorAppShell`, and does not use `ProductWorkspaceShell`. Product create/edit Workspace routes continue to render outside `CreatorAppShell`.

Product Overview reuses the existing single-Product read path: Product service → `getProductById` thunk → Product Redux `currentProduct` → existing Product selectors and normalizers. It does not define or require a new Product Overview backend API. The page clears `currentProduct` before loading a route Product ID and renders loaded Product data only when `currentProduct.id` matches the route `productId`, preventing stale previous-product details during route transitions.

Current Product Overview content:

- Back to Products navigation.
- Product thumbnail when available, Product name, Product type, semantic Product status, description, and updated date.
- Compact Product details: status, type, price, created date, and updated date.
- Primary `Edit product` action to Product Workspace.
- Secondary `Edit landing page` action to Product Landing Page Builder.
- Published-only `View public page` action to the existing buyer-facing Product page.

Type-specific read-only summaries:

- `COURSE`: section/module count, lesson count, and compact section outline.
- `DOWNLOAD`: section count, file count where loaded Product data supports it, and compact section outline.
- `CONSULTATION`: configured details such as duration, meeting method, buffers, max sessions per day, messages/policies, and calendar information when present.
- `MEMBERSHIP`: generic Product information and configured recurring pricing only.

Product Overview V1 intentionally does not include product-scoped revenue, order counts, customer counts, subscribers/members, conversion, charts, recent orders, ratings/reviews, Storefront visibility controls, access/entitlement management, duplicate/archive, explicit publish/unpublish workflow, inline landing-page customization controls, SEO, or new backend APIs. Do not use deterministic mocks to imply those capabilities exist.

Creator product navigation principle:

- Product identity links should generally navigate to Product Overview.
- Explicit `Edit product` and Product building actions should navigate directly to Product Workspace.
- Explicit `Edit landing page` actions should navigate to Product Landing Page Builder.
- Explicit `View public page` actions should navigate to the public Product Landing Page.

This principle currently applies to Creator Products list identities, Creator Dashboard product destinations, Creator Analytics product ranking rows, and Creator Sales product identity links in the ledger and Order Detail. Explicit edit/build actions, such as `Edit product`, builder CTAs, Dashboard attention actions that mean "fix/edit this product", and Admin explicit Edit actions, remain Product Workspace links.

## Product Landing Page V2 Foundation

Public Product Landing Page V2 replaces the legacy placeholder-heavy `ProductPage` presentation behind `/app/product/:id` and `/app/product/:id/:type`.

Current route separation:

- Creator Product Overview: `/app/products/:productId`.
- Creator Product Landing Page Builder: `/app/products/:productId/landing-page`.
- Focused Product Workspace: `/app/products/edit/:id` and `/app/products/edit/:type/:id`.
- Public Product Landing Page: `/app/product/:id`; `/app/product/:id/:type` remains a compatibility path that redirects to the canonical ID-only path when the type segment does not match the loaded Product.

Product Overview and Product Landing Page Builder render within the Creator management architecture. Product Workspace remains the focused editing workspace outside the normal Creator shell. The public Product route owns route params, loading/error/unavailable states, temporary data composition, public visibility checks, and compatibility redirects. It renders the shared `ProductLandingPage` presentation under `src/domains/app/features/product-landing-page`. The authenticated Creator Product Landing Page Builder reuses the same shared presentation as its live preview; Creator-only editing chrome lives around the shared renderer, not inside it.

Current Product Landing Page data boundary:

- Both the public route and Creator builder still use the existing Product service → `getProductById` thunk → Product Redux `currentProduct` path as a temporary frontend source for canonical Product data.
- The shared presentation consumes a narrow Product Landing Page view model rather than Redux, route params, or raw Product service responses directly.
- The route clears stale `currentProduct` before loading a route Product ID and only composes the landing page when the loaded Product ID matches the route ID.
- Product Landing Page config is a narrow backend-pending domain under `src/core/api/models/product-landing-page`, `src/core/api/services/product-landing-page`, and `src/core/store/product-landing-page-store`. Current runtime path is Component → Redux thunk → Product Landing Page service → Axios → production backend or ignored local HTTP mock. Components must not branch directly on `REACT_APP_USE_MOCKS`.
- Current service shapes are `GET api/products/:productId/landing-page` for public-safe config reads and `GET`/`PATCH api/creator/products/:productId/landing-page` for authenticated Creator reads/writes. Local ignored HTTP mocks support these endpoints under `REACT_APP_USE_MOCKS=true`; do not treat them as production backend implementation.
- A dedicated public Product read model remains a future backend requirement. That future read model should provide public-safe Product fields, public Creator presentation, persisted landing-page configuration, public visibility enforcement, and checkout/access availability without requiring the buyer-facing route to orchestrate internal Product/User/Storefront reads.

Current public Product Landing Page behavior:

- Renders only `PUBLISHED` Products as public Product pages. `DRAFT` and `HIDDEN` render an unavailable/not-found-style public state. This frontend guard is not a security boundary; production enforcement still belongs in the future public Product read contract.
- Uses real Product-owned data: Product type, name, description, price, recurring pricing metadata where present, thumbnail/image, and loaded type-specific content.
- Removes legacy fake Product page claims such as hardcoded creator name, fake ratings/review/customer counts, fake language, fake durations, placeholder includes, hardcoded short description, placeholder-only image behavior, inert `Buy Now`, and inert `Add to Cart`.
- Shows honest purchase/access unavailable states because checkout, free-product fulfillment, Membership subscription checkout, entitlement/access, and waitlist contracts are not implemented.
- Inherits the Creator Storefront theme when an existing real Storefront/theme source is available through current frontend architecture; otherwise it falls back to `DEFAULT_STOREFRONT_THEME`. Product-specific theme overrides are not implemented, and this inheritance affects the public Product presentation/Builder preview rather than Creator management chrome.
- Applies persisted public-safe Product Landing Page config when available, including marketing description, hero layout, supported secondary section visibility, and supported secondary section order. It must still render safely without depending on a Creator-only endpoint.
- Renders real Creator identity only when available from the existing public Storefront read model or from current authenticated owner profile state. Anonymous/public creator identity must eventually come from the dedicated public Product read model.

Type-specific public summaries:

- `COURSE`: module/section count, lesson count, curriculum outline, lesson titles, and lesson types from loaded Product sections.
- `DOWNLOAD`: section count, file/resource count where loaded, section outline, and file names only. It does not expose storage URLs or technical file metadata.
- `CONSULTATION`: public-relevant configured details such as duration, meeting method, session buffers, daily availability, confirmation/cancellation messaging, and connected calendar availability when present.
- `MEMBERSHIP`: conservative Product-owned Membership positioning and recurring pricing only. It does not claim member counts, subscriber counts, revenue, entitlement state, or Membership feed details.

Creator Product Landing Page Builder current behavior:

- Route `/app/products/:productId/landing-page` is authenticated for Creator/Admin users and is launched from Product Overview via `Edit landing page`.
- The builder loads canonical Product data, loads the Product Landing Page config, creates a local draft, and maps Product + draft config + Creator/theme inputs into the shared `ProductLandingPage` preview.
- Draft edits update the live preview immediately and do not PATCH individually. The `Save` action persists the full landing-page config through the backend-pending Creator config service; `Reset` restores the last persisted config/default normalization. Unsaved state is surfaced by enabled/disabled Save/Reset actions, save loading state, and success/error status copy.
- Config owns only `marketingDescription`, `heroLayout` (`MEDIA_RIGHT`/`MEDIA_LEFT`), supported secondary-section visibility (`ABOUT`, `CONTENTS`, `CREATOR`), and supported secondary-section order for those IDs.
- Current customization capabilities are limited to additional marketing/about copy, hero media side/layout, supported secondary-section visibility, and supported page-section order. The Builder reorders page sections, not Course modules, Download files, Consultation fields, or other Product content entities.
- Desktop Builder customization uses a compact controls panel beside the live preview; mobile customization uses the shared `Drawer` infrastructure.
- Authenticated Builder can render non-public Product states for editing and displays Product status context. Editing a Draft/Hidden Product landing page does not make it publicly available and does not add a publish workflow.
- Product-owned fields such as name, description, type, status, price, pricing model, currency, thumbnail, and type-specific content remain read-only here and should be edited through Product Workspace.
- User/Profile-owned Creator display fields and Storefront/theme ownership are not duplicated into Product Landing Page config. Product-specific theme overrides are intentionally not part of Task 2.

Product Landing Page V2 intentionally does not implement galleries, slideshows, promo video/presentation upload, reusable asset library, checkout, Stripe/PayPal, free Product fulfillment, Membership subscriptions, waitlists, entitlement/access, reviews/ratings, Product analytics, SEO, slugs/custom domains, arbitrary page-builder blocks, or new production backend APIs.

Intentional model decisions:

- Product union types live in `src/core/api/models/product`.
- `AbstractProduct` is a discriminated union of course/download/consultation/membership.
- `ProductDraft` allows incomplete frontend state before backend persistence.
- `mapFormDataToProductPayload` maps drafts to backend payloads and keeps unsupported product types explicit. Membership maps only shared Product fields and Product-owned recurring pricing metadata.
- Product normalizers handle backend `details` payload shape for sections and consultation details. Membership-specific state loads through the separate Product-scoped Membership contracts, not Product `details`.
- Product type metadata is centralized in `src/core/constants/products.ts` and drives create options, basic info options, filters, headers, and type metadata.

Membership content architecture:

- Native Membership content is modeled under `src/domains/app/features/product-form/membership-content/models` for UI/domain helpers and under `src/core/api/models/membership` for backend-pending API DTOs.
- Native Membership content types are `POST`, `VIDEO`, and `RESOURCE`, with statuses `DRAFT`, `PUBLISHED`, and `HIDDEN`.
- Native Membership content must not be added to `AbstractProduct`, Product autosave payloads, or Product normalizers.
- Included standalone Products remain Products, currently represented by `ProductMinimised`; Course/Download products must not be converted into native Membership content entities.
- Membership persisted domain state is owned by `membership-store`, keyed by Product ID. Product Redux remains the owner of the generic Product shell.
- Membership feed entries are Membership metadata objects for native content and included Products. They carry deterministic identities (`content:{contentId}` / `product:{productId}`), Membership-specific `addedAt`, and `position` for manual order; Product `createdAt` must not be used as Membership added time.
- Membership content ordering is Membership-owned. `NEWEST_FIRST` is the default derived view sorted by feed-entry `addedAt`; `MANUAL` persists feed-entry positions through the Membership feed contract.
- Switching from `NEWEST_FIRST` to `MANUAL` initializes manual order from the currently visible newest-first sequence. Switching back to `NEWEST_FIRST` derives chronological display from persisted feed metadata.
- Manual ordering uses unified Move Up / Move Down controls for native content and included Products. Do not add ordering fields to Product entities.
- `MembershipContentList` is the presentation shell that renders a unified Membership content hub by resolving ordered feed entries against native content items and included Products.
- `MembershipContentSection` owns only transient inline `+ Add Content` chooser, editor draft, and editing-mode state.
- `MembershipContentTypeChooser` is presentation/control-only. It offers `Video`, `Post`, `Resource`, and `Existing Product`, but does not fetch data or create content.
- Selecting `Post` opens `MembershipPostEditor`, a controlled editor for unsaved title, body, and status drafts; save dispatches Membership content CRUD.
- Selecting `Video` opens `MembershipVideoEditor`, a controlled editor for title, description, selected video file metadata, and status. Video selection uses `UppyFileUploader` in selection-only mode; binary upload still needs a reusable backend asset lifecycle.
- Selecting `Resource` opens `MembershipResourceEditor`, a controlled editor for title, description, selected file metadata, and status. Resource selection uses `UppyFileUploader` in selection-only mode; binary upload still needs a reusable backend asset lifecycle.
- Post, Video, and Resource create/edit/delete use Membership service/Redux contracts and must not write to Product autosave or Product API payloads.
- Selecting `Existing Product` closes the chooser and requests that `MembershipIncludedProducts` open its existing `ProductPicker`; no second ProductPicker or duplicated product loading logic should be introduced.
- The current deterministic manual list order is feed-entry array order. There is no drag-and-drop, populated `position`, or persisted ordering contract yet.
- `MembershipIncludedProducts` owns Product summary loading and picker state. Included Product relationship state, add/remove behavior, and duplicate prevention are controlled by the lifted Membership builder state.

## Current Feature State

Implemented / reasonably wired:

- Auth signup, login, verify email, forgot password, Google sign-in hooks.
- Protected routes by role.
- Creator management shell with Dashboard, Products, Customers, Sales, Analytics, Storefront, and Settings destinations; Help is visible as a disabled planned destination.
- Creator Dashboard redesign with business metrics, recent activity, top products, and needs-attention panels.
- Creator Products management redesign with local search/filter/sort, list/table desktop composition, mobile management cards, and distinct empty/loading/error states.
- Creator Product Overview V1 at `/app/products/:productId` with Product identity/details, real Product-owned type-specific summaries, and edit/public-page actions.
- Creator Customers management area with a customer list and dedicated customer detail route.
- Creator Sales management area with overview metrics, an orders ledger, local search/filter/sort/date preset controls, local pagination, responsive layout, empty/no-result states, and contextual order detail inspection.
- Creator Analytics management area with period-scoped business metrics, performance visualization, product ranking, customer growth, membership health, and payment health.
- Creator Storefront Builder at `/app/storefront`, where the shared public Storefront presentation is the live editing surface for profile fields, theme, featured product, and product ordering.
- Public Storefront page at `/app/store/:creatorId` with creator identity/profile information, featured product when applicable, and a customer-facing published-product catalogue.
- Public Product Landing Page V2 foundation at `/app/product/:id` with a shared public presentation, honest real Product data, frontend `PUBLISHED` visibility guard, Storefront/default theme inheritance, type-specific real-data summaries, and explicit unavailable purchase/access state.
- Creator Product Landing Page Builder at `/app/products/:productId/landing-page` with shared `ProductLandingPage` live preview, local Save/Reset draft behavior, and backend-pending config contracts for marketing description, hero layout, and supported secondary-section visibility/order.
- Product create/edit builder for course/download/consultation/membership basics.
- Membership builder integration with a Membership Content tab.
- Generic reusable Product Picker used by Membership included-product selection.
- Unified Membership content list foundation, inline `+ Add Content` chooser, and Membership-backed Post/Video/Resource create/edit/delete flows.
- Course/download section creation, autosave, deletion.
- Course lesson creation, autosave, deletion for `VIDEO`, `ARTICLE`, `QUIZ`; assignment is placeholder.
- Download section file upload via presigned URL + confirm upload.
- Admin users page: search/filter users and update single role.
- Admin products page: search/filter products, delete products, edit/view, create product for selected creator.
- Admin audit page: list/filter audit logs.
- Marketing pages and shared marketing layout.
- Storybook setup for shared/components.

Partially implemented / placeholder:

- Creator Help navigation destination is disabled because an implementation is not available yet.
- Cart/wishlist exist mostly frontend-side/localStorage; persistence/checkout contract is not clearly backend-backed.
- Public Product Landing Page still uses the existing Product read path as a temporary source. Product Landing Page config has frontend contracts, Redux state, and ignored local HTTP mocks, but production config persistence, a dedicated production public Product read model, public creator payload, server-enforced visibility, and checkout/access/waitlist state remain unimplemented.
- Membership included products are limited to existing Course/Download products and persist as Membership feed Product-ID associations through backend-pending contracts.
- Native Membership Post, Video, and Resource content have backend-pending frontend contracts, services, Redux state, and ignored local HTTP mocks. Native Video/Resource binary upload remains unresolved beyond selected file metadata/asset reference.
- Membership recurring pricing is Product-owned via backend-pending Product pricing fields: `pricingModel`, `billingInterval`, and `currency`, with Product `price` as the amount source of truth.
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
- `.github/workflows/docs.yml` expects a `docs/` directory, but no `docs/` directory exists in this checkout.
- `src/core/store/shop-cart/shop-cart.slice.ts` removal has a likely index bug: index `0` is treated as false, so the first cart item may not remove.
- Membership has frontend contracts, services, Redux store integration, and ignored local HTTP mock responses for Product-scoped aggregate/config, native content CRUD, and feed/included-product associations, but the production backend endpoints are not implemented yet.
- Product recurring pricing has frontend model/form support, but the production backend Product contract is not implemented yet.
- Membership Video/Resource binary asset upload remains backend-pending; the existing Download section upload flow is section-scoped and should be generalized or adapted before claiming real Membership media persistence.
- Membership has no subscription/entitlement/member-access model yet.
- Creator Customers has frontend contracts, services, Redux store integration, and HTTP mock responses for read-only list/detail data, but the production backend endpoints are not implemented yet. Purchase/order, entitlement/access, subscription/customer membership-state, waitlist, tags/notes persistence, and manual access-management backend ownership still need backend confirmation.
- Creator Sales has frontend contracts, services, Redux store integration, and HTTP mock responses for summary, orders ledger, and order detail data, but the production backend endpoints are not implemented yet. Provider-safe financial mutations, refund/payment retry actions, subscription management, and entitlement mutation contracts are intentionally not implemented.
- Creator Analytics has frontend contracts, services, Redux store integration, and HTTP mock responses for aggregate overview data, but the production backend endpoint is not implemented yet. Traffic, attribution, conversion, engagement, payout, cohort, and custom date-range analytics are intentionally not implemented.
- Creator Storefront has frontend contracts, services, Redux store integration, and HTTP mock responses for the public read model and Creator configuration, but the production backend endpoints are not implemented yet. Storefront theme/config fields are frontend-wired through the backend-pending Storefront contracts; arbitrary page-builder blocks, custom-domain, SEO, and Storefront analytics contracts are intentionally not implemented.

Deliberate temporary implementations:

- `REACT_APP_USE_MOCKS` can load ignored local `src/core/api/_mocks.ts`.
- `REACT_APP_USE_MOCKS=true` also enables deterministic Creator visual-inspection data for authenticated Creator identity, Products, Dashboard, Analytics, Storefront, and Membership. Customers, Sales, Analytics, Dashboard, Storefront, and Membership use Redux/services/Axios and receive deterministic data from ignored local HTTP mocks rather than feature-level fixture branches. Production must not fake unsupported Creator business metrics, customer records, sales/order/payment records, analytics aggregates, storefront configuration, membership content/feed state, or customer-domain states.
- Blank section/lesson drafts exist locally until enough data is present for backend creation.
- Creator Dashboard uses a frontend contract, service, Redux store integration, and ignored local HTTP mock response for the aggregate summary. When the backend contract is unavailable, Dashboard metric panels intentionally render unavailable business states rather than fabricated values.
- Creator product identity navigation now prefers Product Overview (`/app/products/{productId}`), with explicit editing/building actions kept on Product Workspace (`/app/products/edit/{productId}`).
- Creator Products inspection fixtures currently come through ignored local mock data in `src/core/api/_mocks.ts` when mocks are enabled.
- Creator Customers runtime data path is Component → Redux → thunk → Customer service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
- Creator Sales runtime data path is Component → Redux → thunk → Sales service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
- Creator Analytics runtime data path is Component → Redux → thunk → Analytics service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
- Creator Dashboard runtime data path is Component → Redux → thunk → Dashboard service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
- Public Storefront runtime data path is Component → Redux → thunk → Storefront service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
- Creator Storefront Builder config runtime data path is Component → Redux → thunk → Storefront service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
- Product Landing Page config runtime data path is Component → Redux thunk → Product Landing Page service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`. Public Product route currently applies public-safe landing-page config through this transitional contract, while a dedicated production public Product read model remains the long-term owner of public Product payload, landing config, visibility, and checkout/access availability.
- Membership domain runtime data path is Component → Redux → thunk → Membership service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
- Download upload deduping is local to the section editor instance.
- Membership editor drafts, selected File objects, chooser/picker state, active editor state, and active builder tab remain local UI state.

Speculative / verify before changing:

- Backend shape for lesson rich text, quiz payloads, video upload, and checkout/cart.
- Backend contracts for Membership native content, included products, recurring pricing, subscriptions, entitlements, and member access.
- Whether product type changes after creation should remain disallowed in edit mode; current UI limits edit mode to current type in `BasicInfo`.

## Creator Dashboard

The redesigned Creator Dashboard in `src/domains/app/pages/creator-specific/creator-dashboard/creator-dashboard.component.tsx` is the reference implementation for the current authenticated Creator visual language.

Implemented Dashboard concepts:

- Business metrics: Revenue, Sales, Customers, Active memberships.
- Metric direction and metric sentiment are modeled separately in the dashboard inspection fixture types. UI copy is concise while preserving semantic styling and accessible trend labels.
- Revenue and Sales metric cards navigate to Sales when deterministic inspection data is enabled.
- Recent activity, Top products, and Needs attention are separate components under `src/domains/app/pages/creator-specific/creator-dashboard/components`.
- Top products navigate to Product Overview routes when a destination exists.
- Recent activity rows are only interactive when a meaningful destination exists; customer/member-only activity states without real destinations remain non-interactive.
- Needs attention actions navigate only when an action path exists.
- Responsive ordering is intentional: metrics remain first, and when panels become sequential the actionable Needs attention panel takes priority before historical Recent activity.

Important data rule:

- The Dashboard is an aggregate read model. Metrics/business states not yet supported by production APIs may be represented only by deterministic development-only HTTP mock data when `REACT_APP_USE_MOCKS=true`.
- Production must not fake those values. With mocks off or when the backend contract is unavailable, the dashboard renders unavailable states.

## Creator Sales Management

The Creator Sales area is implemented under `src/domains/app/pages/creator-specific/sales-page` and is the Creator-facing financial operations ledger for inspecting orders, payment outcomes, refund context, and resulting access state.

Routes and contextual state:

- Sales workspace: `/app/sales`.
- Selected order detail uses query state, for example `/app/sales?order=ORD-2026-00124`.
- Query-state selection keeps the user in the Sales workspace while opening contextual order inspection, supports refresh/deep links/browser navigation, and preserves the parent ledger context.
- This query-state drawer pattern is a reusable option for contextual inspection. Do not treat it as a requirement for every detail surface.

Current Sales page patterns:

- The page heading is `Sales`, not `Sales & Analytics`.
- Overview metrics are Revenue, Orders, Refunds, and Failed payments.
- Metrics are scoped to the selected date preset. Ledger results also apply search, status, product, and sort refinements.
- Desktop uses a compact orders ledger with Date, Customer, Product, Status, Type, and Amount.
- Tablet/mobile reduce columns and transform ledger rows into compact transaction cards rather than shrinking the desktop table.
- Order identity opens the contextual Order Detail drawer. Customer identity links to Customer Detail when a customer ID exists. Product identity links to Product Overview when a product ID exists.
- Local controls include search by customer/email/order ID, date preset filter, order status filter, product filter, sorting, result count, Clear filters, and local pagination.
- Empty states distinguish no sales, search-no-results, filter-no-results, and production unavailable states.
- Mobile uses the shared `Drawer` for filter controls.

Current Sales domain model:

- Order statuses represented by the frontend are `Paid`, `Failed`, `Refunded`, and `Pending`.
- Order types represented by the frontend are `One-time`, `Subscription`, and `Renewal`.
- Refunds are represented as status/context on the original order, not as a separate Creator-facing refund entity or refund ledger.
- The Order Detail drawer is read-only. It can show order amount/type/date, customer, product, payment facts, order summary, access outcome, subscription context, refund context, and failed-payment context when fixture data contains those fields.
- Sales explains access consequences but does not expose entitlement grant/revoke controls.
- Sales shows subscription context for recurring Membership charges but does not expose subscription-management actions.
- Sales does not currently include charts, analytics, payouts, invoices, tax reporting, disputes, export tooling, refunds-as-actions, manual retries, or provider administration.

Important Sales boundary:

- Current Sales read data flows through frontend contracts/services/Redux and Axios. Local deterministic data exists only behind ignored HTTP mocks when `REACT_APP_USE_MOCKS=true`.
- The current frontend defines backend-pending read contracts for Sales summary, Orders page, and Order detail, but does not define provider-safe financial mutations, refund/payment retry actions, subscription management, or entitlement mutation contracts.
- With mocks off or when backend contracts are unavailable, Sales renders an unavailable state rather than fabricated financial data.
- Do not introduce production APIs or financial mutation behavior merely to support the current inspection UI.

## Creator Analytics

The Creator Analytics area is implemented under `src/domains/app/pages/creator-specific/creator-analytics` and is the Creator-facing surface for inspecting aggregate business performance across revenue, orders, customer growth, memberships, product performance, and payment health.

Routes and shell integration:

- Analytics workspace: `/app/analytics`.
- The route is protected for Creator/Admin users.
- Analytics is part of the Creator management navigation and renders inside `CreatorAppShell`.

Current Analytics page patterns:

- Page-level period selection is limited to `Last 7 days`, `Last 30 days`, and `Last 90 days`. There is no custom date-range UI or contract.
- Summary metrics are Revenue, Orders, Customers, and Active memberships.
- The Performance visualization supports Revenue and Orders modes over the selected period.
- Product Performance ranks products by revenue share while showing revenue, orders, share percentage, share meters, rank, and Product Overview links.
- Customer Growth, Memberships, and Payment Health are separate lower-page sections.
- Membership analytics currently present active, new, cancelled, churn-rate, and movement visualization when inspection data exists.
- Payment Health currently presents refund-rate and failed-payment aggregates plus a compact trend visualization.
- Empty/unavailable states are explicit: non-mock mode renders Analytics unavailable, and empty product/performance inputs render shared chart empty states.
- Desktop, tablet, and mobile layouts change composition through the Analytics SCSS rather than relying on a shrunken desktop grid.

Current Analytics architecture:

- Recharts renders the chart visuals.
- Shared primitives from `src/shared/ui/chart` provide generic chart containers, legends, tooltips, and empty states.
- Analytics-specific components under `creator-analytics/components` own domain labels, metric modes, section composition, and business-specific summaries.
- Chart styling uses the global visualization CSS tokens in `src/styles/_variables.scss`.
- Accessibility expectations include semantic labels/descriptions on chart containers, Recharts `accessibilityLayer` where available, keyboard-accessible metric toggles, product ranking links with full title access, and textual insight summaries outside the chart visual.

Important Analytics boundary:

- Current Analytics read data flows through a frontend contract/service/Redux and Axios. Local deterministic data exists only behind ignored HTTP mocks when `REACT_APP_USE_MOCKS=true`.
- The current frontend defines a backend-pending read contract for `api/creator/analytics/overview` with 7d/30d/90d period queries.
- Mock totals and comparisons are local visual-inspection values and are not product contracts. Do not preserve specific mock revenue/order/customer/membership numbers as meaningful behavior in documentation or tests unless a test is explicitly covering deterministic inspection rendering.
- With mocks off or when the backend contract is unavailable, Analytics renders an unavailable state rather than fabricated analytics data.
- Do not infer traffic, conversion, attribution, payout, tax, course-engagement, cohort, custom date-range, or other analytics capabilities from the current page.

## Creator Storefront

Storefront V2 is split between an authenticated Creator/Admin Storefront Builder and a public customer-facing Storefront. Both routes share Storefront view-model utilities and the `StorefrontPublicPage` presentation under `src/domains/app/features/storefront`.

Routes and shell integration:

- Creator/Admin Storefront Builder: `/app/storefront`.
- Public buyer-facing Storefront route: `/app/store/:creatorId`.
- Legacy `/app/my-page-preview` redirects to `/app/storefront`; the old `user-page-preview` implementation has been removed.
- Storefront Builder renders inside `CreatorAppShell`, and the `/app/storefront` route uses `collapseSidebarOnLoad` route metadata so the Creator sidebar collapses with the same shell/sidebar pattern used by builder-style routes.
- The public Storefront route renders outside Creator management chrome and outside the older marketplace `TopNavbar` shell.

Current Storefront Builder patterns:

- `/app/storefront` is a live Storefront Builder, not the previous management-controls plus separate preview layout.
- The builder itself consumes the same `StorefrontPublicPage` used by the public route, so the shared public presentation is the live preview/editing surface.
- Builder chrome is compact and includes unsaved-state copy, `Open public Storefront`, copy-link, `Reset changes`, and `Save changes` actions.
- Public-facing profile fields are editable inline where implemented: display name, title, tagline, bio, website, and public email. Inline editors use edit buttons, Save/Cancel actions, existing shared input/textarea/button/popover primitives, and `updateUserDetails` from the Auth/User profile flow.
- Avatar/image inline editing is not implemented. The Settings image UI does not currently expose a clean reusable persisted upload flow for Storefront Builder to reuse.
- Public profile information reuses existing User/Profile fields instead of introducing a separate Storefront profile model. Storefront config must not duplicate display name, title, tagline, bio, website, image, social links, or public email.
- `publicEmail` is User/Profile-owned. The Storefront view model uses `publicEmail` when set and falls back to the login email when no separate public email is configured. Settings and Storefront share the same public-email concept and the same info-popover copy: "This is the email shown on your storefront. It can be different from the email you use to sign in."
- Storefront-owned configuration is edited as one local draft containing `theme`, `featuredProductId`, and `productOrderIds`.
- Theme, featured-product, and ordering changes update the rendered builder immediately but do not PATCH individually.
- `Save changes` persists the full draft Storefront config through `PATCH api/creator/storefront`; `Reset changes` restores the last persisted Redux config.
- Product status visibility remains explicit in the builder controls, but Draft/Hidden products are not rendered through the shared public Storefront presentation.

Current Storefront theme/customization patterns:

- `StorefrontTheme` supports `appearance`, `accentColor`, and `typography`.
- Appearance options are `LIGHT` and `DARK`.
- Typography options are `MODERN`, `CLASSIC`, and `FRIENDLY`.
- Brand color supports curated swatches plus a custom color input.
- Theme rendering is Storefront-scoped through `StorefrontPublicPage` classes and CSS variables such as `--storefront-accent`; it does not switch the global Creator app theme.
- Accent color affects public Storefront CTAs, eyebrow/accent text, creator initials/accent details, borders, and related highlights.
- The customization UI is a floating FAB and compact panel on larger screens. At mobile width the same controls open through the shared `Drawer` infrastructure.

Current public Storefront patterns:

- `StorefrontPage` loads the public read model through Redux and `GET api/storefronts/:creatorId`, maps it with `getStorefrontViewModelFromPublicStorefront`, and renders `StorefrontPublicPage`.
- `StorefrontPublicPage` renders creator identity/profile information, optional website link, public email/contact links, social links, a featured product when the featured product is publicly visible, and a catalogue of public products.
- Public Storefront receives and applies the persisted theme from the public read model, with `DEFAULT_STOREFRONT_THEME` as a fallback when theme is absent.
- Product visibility is centralized in Storefront utilities: `PUBLISHED` products are publicly visible; `DRAFT` and `HIDDEN` products are not publicly visible.
- Invalid or unavailable featured-product IDs fall back to the first public product.
- Course, Download, Consultation, and Membership products are all represented with Storefront type labels. Membership remains supported in public rendering.
- Empty and unavailable states are explicit, including the public empty catalogue state when no products are published.

Current Storefront data boundary:

- The public Storefront route uses the backend-pending `api/storefronts/:creatorId` read-model contract through Redux/services/Axios. The backend should return public creator presentation fields, public products, featured product ID, and persisted theme rather than requiring the buyer-facing page to orchestrate User, Product, and Storefront config requests.
- Creator Storefront Builder uses the backend-pending `api/creator/storefront` config contract through Redux/services/Axios. The config owns only `theme`, `featuredProductId`, and `productOrderIds`.
- Storefront service functions live under `src/core/api/services/storefront`, thunks/state live in `src/core/store/storefront-store/storefront.slice.ts`, and selectors are intentionally kept in `src/core/store/storefront-store/storefront.selectors.ts`.
- Product remains the owner of catalogue/product data, statuses, prices, thumbnails, and public visibility eligibility.
- User/Profile remains the owner of public profile identity and contact fields, including `publicEmail`.
- Creator Storefront Builder combines Storefront config with Product-owned summaries from existing Product Redux/API data and User/Profile-owned account data from Auth.
- Local deterministic Storefront data exists only behind ignored HTTP mocks when `REACT_APP_USE_MOCKS=true`. Mock creator IDs, profile content, theme values, example products, product order, and featured selections are local inspection aids, not product contracts.
- Storefront V2 does not implement arbitrary page-builder blocks, custom domains, SEO management, Storefront analytics, coupons, campaigns, newsletters, automations, attribution, or Reviews surfaces.

## Creator Products Management

The Creator product list is now a management page named `Products`, implemented under `src/domains/app/pages/creator-specific/products/products-list`.

Current implemented patterns:

- Desktop uses a compact list/table hybrid with Product, Status, Price, Updated, and Actions columns.
- Mobile transforms rows into management cards rather than shrinking the desktop table.
- Product identity/title is the primary navigation to Product Overview (`/app/products/{product.id}`). Explicit editing actions should use Product Workspace (`/app/products/edit/{product.id}`).
- There are no permanent Edit buttons and no fake/permanent Publish buttons in the list.
- Overflow menus render only when meaningful secondary actions exist. Published products can expose Preview (`/app/product/{product.id}`); products with no secondary action do not render an ellipsis just for symmetry.
- Lifecycle status is shown with compact badges.
- Pricing is formatted as one-time EUR, recurring Membership EUR where Product recurring metadata is present, Free, or Price not set.
- Desktop dates stay concise under the visible Updated heading. Tablet/mobile add explicit context such as `Updated Aug 10` when the heading disappears, while preserving accessible full-date/title behavior.
- Local management controls include Search, Type filter, Status filter, Sort, result count, and Clear filters for active refinements.
- Empty states distinguish true empty catalog, search-no-results, filter-no-results, loading, and error.
- For a true zero-product catalog, management search/filter/sort controls and result count are intentionally hidden; the onboarding empty state appears directly below the Products introduction with `Create your first product` and `+ Add product`.

Do not document or introduce unsupported list actions such as Delete, Duplicate, Archive, Publish, or Unpublish unless the implementation actually adds them.

## Creator Customers Management

The Creator customer area is implemented under `src/domains/app/pages/creator-specific/customers` and is the Creator-facing surface for understanding customer relationships across buyers, members, past-due members, and waitlist leads.

Routes:

- Customer list: `/app/customers`.
- Customer detail: `/app/customers/:customerId`.

Current Customer List patterns:

- Desktop/tablet use a management list/table hybrid with Customer, Status, Products, Total spend, and Last activity columns.
- Mobile transforms rows into compact customer cards rather than shrinking the desktop table.
- Customer identity (name/email) is the primary navigation to Customer Detail.
- There is intentionally no Actions column or overflow menu because no meaningful secondary customer row actions exist yet.
- Local controls include name/email search, relationship/status filter, product filter, membership filter, sorting, result count, and clear active refinements.
- Empty states distinguish true empty customer list, search-no-results, filter-no-results, and production unavailable states.
- The current relationship states are `Active member`, `Past due`, `Buyer`, and `Waitlist`.

Current Customer Detail patterns:

- Customer Detail is a real page, not a modal.
- The header is a contained profile/identity surface with avatar/initials, name, relationship status, email, and customer-since information when available.
- Summary metrics currently include Total spent, Orders, Active access, and Membership.
- Detail sections use accessible tabs: Overview, Purchases, Access, and Notes.
- Overview contains customer information, relationship information, tags when present in inspection data, and recent activity where available.
- Purchases, Access, and Notes are read-only in the current implementation.

Important customer-domain boundary:

- Purchases, Access, Notes, tags, waitlist information, spend/order values, membership customer state, and other customer-domain business data are currently deterministic inspection fixtures, not production-backed Creator customer APIs.
- Access state must not imply grant/revoke controls until backend access-management contracts exist.
- Notes/tags must not imply editable CRM persistence until a notes/tags API exists.
- Do not infer fake CRM actions, fake communication features, fake persistence, fake access management, or speculative customer operations from the UI.
- Customer fixtures are gated behind `REACT_APP_USE_MOCKS=true`; production must not fabricate unsupported Customer business data.

Reusable Customers-local patterns include `CustomerAvatar`, `CustomerStatusBadge`, `CustomerManagementRow`, and customer formatting/filtering utilities in `creator-customers.utils.ts`. Keep these Customer-specific unless another area has a concrete need; do not introduce a generalized CRM/data-grid layer prematurely.

## Responsive Creator Architecture

Responsive Creator UI should change composition intentionally rather than simply shrink desktop layouts.

Implemented examples:

- Creator sidebar becomes compact/collapsible on desktop; its account footer follows expanded/collapsed presentation, while tablet/mobile retains the existing top-bar plus drawer navigation model.
- Dashboard metrics change layout across breakpoints and panel order changes when content becomes sequential.
- Products desktop list/table becomes mobile management cards.
- Customers desktop/tablet list/table becomes mobile customer cards while preserving the stacked mobile filter controls.
- Sales desktop orders ledger becomes tablet/mobile transaction cards, and mobile secondary filters move into the shared Drawer.
- Analytics desktop chart/product/secondary grids collapse into single-column tablet/mobile layouts, with product ranking rows reflowing instead of overflowing.
- Storefront Builder uses compact builder chrome, a floating customization control, and mobile Drawer-based customization behavior while the shared public Storefront hero and product catalogue reflow into single-column customer-facing layouts.
- Product workspace navigation adapts on narrow screens while preserving the focused editing shell.

Avoid hardcoding viewport-specific pixel values into this document; inspect the SCSS breakpoints and component styles when implementing a responsive change.

## Recent / Unfinished Work

Recent Git history includes admin role/product ownership work, Membership frontend work, and the authenticated Creator redesign:

- Admin role management UI and role-based routing.
- Dev role switcher/backend role change support.
- Admin product management and create-for-creator flow using `ownerId` query param.
- Membership added as a first-class frontend Product type.
- Membership uses the shared builder shell, its own Membership Content tab, Product-backed recurring pricing controls, and Product-scoped Membership contracts for Course/Download included-product associations plus Post/Video/Resource content metadata.
- Creator management shell and IA centered on Dashboard, Products, Customers, Sales, Analytics, Storefront, plus Settings utility navigation; Help remains disabled and Marketing is removed from the Creator MVP IA.
- Creator Dashboard, Products, Customers, Sales, Analytics, and Storefront Builder visual redesigns.
- Public Storefront implementation at `/app/store/:creatorId`, sharing Storefront presentation/view-model logic with the Creator Storefront Builder.
- Product Landing Page V2 foundation at `/app/product/:id`, replacing the legacy placeholder Product page with a shared honest public Product presentation, frontend `PUBLISHED` guard, and persisted public-safe config application when available.
- Creator Product Landing Page Builder at `/app/products/:productId/landing-page`, launched from Product Overview and using the shared public landing page as a live preview for narrow landing config edits.
- Product Overview V1 at `/app/products/:productId`, establishing Product identity navigation to Overview and edit/build navigation to Product Workspace.
- Focused Product Workspace shell for product editing.

Likely next steps:

- Polish/fix admin product owner filtering UX beyond raw owner ID.
- Define the production public Product read model and Product Landing Page config persistence so `/app/product/:id` can stop orchestrating internal Product/User/Storefront reads and can rely on server-enforced public visibility.
- Implement backend Storefront contracts before relying on production persistence for Storefront configuration; define separate contracts before adding arbitrary page-builder blocks, custom domains, SEO, or analytics.
- Fix known warnings and cart removal bug.
- Verify product builder contracts for lesson content, quiz persistence, media upload, and consultation scheduling.
- Define backend contracts for Membership native content, included-product relationships, recurring pricing, subscription checkout, and entitlement/member access before persisting Membership-specific fields.
