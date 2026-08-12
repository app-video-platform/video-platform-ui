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
- Desktop Creator management uses a persistent collapsible sidebar and a separate account/user control.
- Tablet/mobile Creator management uses a compact top bar with a drawer navigation.
- Product builder routes (`/app/products/create`, `/app/products/edit/*`, and `/app/admin/products/create`) intentionally render outside `CreatorAppShell` so editing can use a focused product workspace.
- Marketplace/customer routes still use the older `TopNavbar` shell; the marketplace Explore/Search experience is not part of the Creator management IA. The public Storefront route intentionally bypasses both Creator management chrome and the older marketplace chrome.

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

Shared interaction conventions now include semantic `Button` variants/sizes in `src/shared/ui/button`, accessible loading state via `aria-busy`/disabled behavior, calmer hover/focus/active states, and Escape-to-close dropdown behavior in `src/shared/ui/gal-dropdown/gal-dropdown.component.tsx`. The old global animated growing link underline has been removed from application interactions; unclassed prose links now use a simple underline treatment in `src/styles/_base.scss`. Do not assume every legacy UI has been migrated.

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
- Selecting `Video` opens `MembershipVideoEditor`, a controlled editor for title, description, selected video file metadata, and status. Video selection uses `GalUppyFileUploader` in selection-only mode; binary upload still needs a reusable backend asset lifecycle.
- Selecting `Resource` opens `MembershipResourceEditor`, a controlled editor for title, description, selected file metadata, and status. Resource selection uses `GalUppyFileUploader` in selection-only mode; binary upload still needs a reusable backend asset lifecycle.
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
- Creator Customers management area with a customer list and dedicated customer detail route.
- Creator Sales management area with overview metrics, an orders ledger, local search/filter/sort/date preset controls, local pagination, responsive layout, empty/no-result states, and contextual order detail inspection.
- Creator Analytics management area with period-scoped business metrics, performance visualization, product ranking, customer growth, membership health, and payment health.
- Creator Storefront management area with public URL/copy affordance, profile summary, product visibility information, featured-product selection, product ordering controls, and a live public preview.
- Public Storefront page at `/app/store/:creatorId` with creator identity/profile information, featured product when applicable, and a customer-facing published-product catalogue.
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

- Product detail page has real loading by product ID but still contains placeholder copy, fake rating/language/duration/creator text, and placeholder image.
- Creator Help navigation destination is disabled because an implementation is not available yet.
- Cart/wishlist exist mostly frontend-side/localStorage; persistence/checkout contract is not clearly backend-backed.
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
- Creator Storefront has frontend contracts, services, Redux store integration, and HTTP mock responses for the public read model and Creator configuration, but the production backend endpoints are not implemented yet. Theme/page-builder, custom-domain, SEO, and Storefront analytics contracts are intentionally not implemented.

Deliberate temporary implementations:

- `REACT_APP_USE_MOCKS` can load ignored local `src/core/api/_mocks.ts`.
- `REACT_APP_USE_MOCKS=true` also enables deterministic Creator visual-inspection data for authenticated Creator identity, Products, Dashboard, Analytics, Storefront, and Membership. Customers, Sales, Analytics, Dashboard, Storefront, and Membership use Redux/services/Axios and receive deterministic data from ignored local HTTP mocks rather than feature-level fixture branches. Production must not fake unsupported Creator business metrics, customer records, sales/order/payment records, analytics aggregates, storefront configuration, membership content/feed state, or customer-domain states.
- Blank section/lesson drafts exist locally until enough data is present for backend creation.
- Creator Dashboard uses a frontend contract, service, Redux store integration, and ignored local HTTP mock response for the aggregate summary. When the backend contract is unavailable, Dashboard metric panels intentionally render unavailable business states rather than fabricated values.
- Creator Dashboard Top products rows currently navigate directly to Product Workspace edit routes (`/app/products/edit/{productId}`) because there is no Product Overview destination yet. Future Creator product-entity navigation should prefer Product Overview, with editing/building as a secondary action from that overview.
- Creator Products inspection fixtures currently come through ignored local mock data in `src/core/api/_mocks.ts` when mocks are enabled.
- Creator Customers runtime data path is Component → Redux → thunk → Customer service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
- Creator Sales runtime data path is Component → Redux → thunk → Sales service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
- Creator Analytics runtime data path is Component → Redux → thunk → Analytics service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
- Creator Dashboard runtime data path is Component → Redux → thunk → Dashboard service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
- Public Storefront runtime data path is Component → Redux → thunk → Storefront service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
- Creator Storefront config runtime data path is Component → Redux → thunk → Storefront service → Axios → backend or ignored local HTTP mock; components do not branch on `REACT_APP_USE_MOCKS`.
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
- Top products navigate to Product Workspace edit routes when a destination exists.
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
- Order identity opens the contextual Order Detail drawer. Customer identity links to Customer Detail when a customer ID exists. Product identity links to Product Workspace when a product ID exists.
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
- Product Performance ranks products by revenue share while showing revenue, orders, share percentage, share meters, rank, and Product Workspace links.
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

The Storefront work is split between an authenticated Creator/Admin management surface and a public customer-facing Storefront, with shared Storefront view-model and presentation logic under `src/domains/app/features/storefront`.

Routes and shell integration:

- Creator/Admin Storefront management workspace: `/app/storefront`.
- Public buyer-facing Storefront route: `/app/store/:creatorId`.
- Legacy `/app/my-page-preview` redirects to `/app/storefront`; the old `user-page-preview` implementation has been removed.
- Storefront management renders inside `CreatorAppShell`.
- The public Storefront route renders outside Creator management chrome and outside the older marketplace `TopNavbar` shell.

Current Storefront management patterns:

- The management page shows Storefront status, public URL, copy-link affordance, public profile summary, product visibility information, featured-product selection, product ordering controls, and a live preview.
- Public profile information reuses existing account/profile user fields such as name, title, tagline, bio, website, image, and social links instead of introducing a separate Storefront profile model.
- Featured selection and ordering controls persist through the backend-pending Creator Storefront config contract. Profile fields remain User/Profile-owned; product identities, statuses, prices, and thumbnails remain Product-owned.
- The live preview uses the same shared `StorefrontPublicPage` presentation as the public Storefront route, with preview styling applied by prop.

Current public Storefront patterns:

- `StorefrontPublicPage` renders creator identity/profile information, optional website link, a featured product when the featured product is publicly visible, and a catalogue of public products.
- Product visibility is centralized in Storefront utilities: `PUBLISHED` products are publicly visible; `DRAFT` and `HIDDEN` products are not publicly visible.
- Invalid or unavailable featured-product IDs fall back to the first public product.
- Course, Download, Consultation, and Membership products are all represented with Storefront type labels.
- The Storefront uses a fixed customer-facing layout. There is no page builder, theme customization system, custom-domain setup, SEO configuration, Storefront analytics, coupons, campaigns, newsletters, automations, attribution, or Reviews surface.
- Empty and unavailable states are explicit, including the public empty catalogue state when no products are published.

Current Storefront data boundary:

- The public Storefront route uses the backend-pending `api/storefronts/:creatorId` read-model contract through Redux/services/Axios. The backend should return public creator presentation fields and public products rather than requiring the buyer-facing page to orchestrate User and Product requests.
- Creator Storefront management uses the backend-pending `api/creator/storefront` config contract through Redux/services/Axios. The config owns `featuredProductId` and `productOrderIds` only.
- Creator Storefront management combines Storefront config with Product-owned summaries from existing Product Redux/API data and User/Profile-owned account data from Auth.
- Local deterministic Storefront data exists only behind ignored HTTP mocks when `REACT_APP_USE_MOCKS=true`. Mock creator IDs, profile content, example products, product order, and featured selections are local inspection aids, not product contracts.

## Creator Products Management

The Creator product list is now a management page named `Products`, implemented under `src/domains/app/pages/creator-specific/products/products-list`.

Current implemented patterns:

- Desktop uses a compact list/table hybrid with Product, Status, Price, Updated, and Actions columns.
- Mobile transforms rows into management cards rather than shrinking the desktop table.
- Product identity/title is the primary navigation to Product Workspace (`/app/products/edit/{product.id}`).
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

- Creator sidebar becomes compact/collapsible on desktop and a mobile drawer at tablet/mobile widths.
- Dashboard metrics change layout across breakpoints and panel order changes when content becomes sequential.
- Products desktop list/table becomes mobile management cards.
- Customers desktop/tablet list/table becomes mobile customer cards while preserving the stacked mobile filter controls.
- Sales desktop orders ledger becomes tablet/mobile transaction cards, and mobile secondary filters move into the shared Drawer.
- Analytics desktop chart/product/secondary grids collapse into single-column tablet/mobile layouts, with product ranking rows reflowing instead of overflowing.
- Storefront management stacks controls and preview on narrower screens, while the public Storefront hero and product catalogue reflow into single-column customer-facing layouts.
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
- Creator Dashboard, Products, Customers, Sales, Analytics, and Storefront management visual redesigns.
- Public Storefront implementation at `/app/store/:creatorId`, sharing Storefront presentation/view-model logic with the Creator live preview.
- Focused Product Workspace shell for product editing.

Likely next steps:

- Polish/fix admin product owner filtering UX beyond raw owner ID.
- Complete product detail UI using real backend fields.
- Implement backend Storefront contracts before relying on production persistence for featured-product selection and product ordering; define separate contracts before adding Storefront-specific settings such as themes, page builder, custom domains, SEO, or analytics.
- Fix known warnings and cart removal bug.
- Verify product builder contracts for lesson content, quiz persistence, media upload, and consultation scheduling.
- Define backend contracts for Membership native content, included-product relationships, recurring pricing, subscription checkout, and entitlement/member access before persisting Membership-specific fields.
