# PROJECT_CONTEXT.md

Generated from repository state:

Branch: main
Commit: b9f5510

Last reviewed: 2026-08-11

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
- `MEMBERSHIP`: shared Product with a Membership-specific builder path; included products, native content foundation, and recurring pricing are currently frontend-only.

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

## Authenticated Creator Management Architecture

Creator/Admin management routes are visually and structurally separated from buyer/marketplace routes in `src/domains/app/pages/app-layout/app-layout.component.tsx`.

- `CreatorAppShell` lives in `src/domains/app/layouts/creator-app-shell/creator-app-shell.component.tsx`.
- Creator navigation is rendered by `SidebarNav` in `src/domains/app/widgets/sidebar-nav/sidebar-nav.component.tsx` using `appRoutes` from `src/core/constants/routes.ts`.
- Desktop Creator management uses a persistent collapsible sidebar and a separate account/user control.
- Tablet/mobile Creator management uses a compact top bar with a drawer navigation.
- Product builder routes (`/app/products/create`, `/app/products/edit/*`, and `/app/admin/products/create`) intentionally render outside `CreatorAppShell` so editing can use a focused product workspace.
- Marketplace/customer routes still use the older `TopNavbar` shell; the marketplace Explore/Search experience is not part of the Creator management IA.

Current Creator IA:

- Functional management destinations: Dashboard (`/app`), Products (`/app/products`), Customers (`/app/customers`), Sales (`/app/sales`), Marketing (`/app/marketing`), Storefront (`/app/my-page-preview`), Settings (`/app/settings`).
- Intentionally disabled sidebar destinations: Analytics (`/app/analytics`), Help (`/app/help`).
- Admin appears as a utility route for admin users only.
- Messages and Reviews are not part of the current Creator MVP navigation. Reviews code still exists under marketing/reviews services/features, but it is not exposed as a Creator IA destination.

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
8. Product details autosave separately from section, lesson, and download-file updates. Membership included products and recurring pricing do not currently autosave to backend Product payloads.

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
- `mapFormDataToProductPayload` maps drafts to backend payloads and keeps unsupported product types explicit. Membership maps only shared Product fields today.
- Product normalizers handle backend `details` payload shape for sections and consultation details; Membership responses currently remain shared Product data with no persisted Membership-specific details.
- Product type metadata is centralized in `src/core/constants/products.ts` and drives create options, basic info options, filters, headers, and type metadata.

Membership content architecture:

- Native Membership content is modeled as frontend/domain state under `src/domains/app/features/product-form/membership-content/models`, not as Product API DTOs.
- Native Membership content types are `POST`, `VIDEO`, and `RESOURCE`, with statuses `DRAFT`, `PUBLISHED`, and `HIDDEN`.
- Native Membership content must not be added to `AbstractProduct`, Product autosave payloads, Product normalizers, or fake backend persistence.
- Included standalone Products remain Products, currently represented by `ProductMinimised`; Course/Download products must not be converted into native Membership content entities.
- Membership builder content state is owned above the conditionally mounted Membership Content tab via `useMembershipBuilderState` in `ProductForm`, so saved native content, included Product relationships, and feed metadata survive tab switches. This state is local React state, not Redux or `ProductDraft`.
- Membership feed entries are frontend-only metadata objects for native content and included Products. They carry deterministic identities (`content:{contentId}` / `product:{productId}`), Membership-specific `addedAt`, and optional future `position`; Product `createdAt` must not be used as Membership added time.
- Membership content ordering is frontend-only and owned by the lifted builder state. `NEWEST_FIRST` is the default derived view sorted by feed-entry `addedAt`; `MANUAL` uses feed-entry array order as the source of truth.
- Switching from `NEWEST_FIRST` to `MANUAL` initializes manual order from the currently visible newest-first sequence. Switching back to `NEWEST_FIRST` derives chronological display without destroying the stored manual sequence for the current builder session.
- Manual ordering uses unified Move Up / Move Down controls for native content and included Products. Do not add ordering fields to Product, Post, Video, or Resource entities.
- `MembershipContentList` is the presentation shell that renders a unified Membership content hub by resolving ordered feed entries against native content items and included Products.
- `MembershipContentSection` owns only transient inline `+ Add Content` chooser, editor draft, and editing-mode state.
- `MembershipContentTypeChooser` is presentation/control-only. It offers `Video`, `Post`, `Resource`, and `Existing Product`, but does not fetch data or create content.
- Selecting `Post` opens `MembershipPostEditor`, a controlled frontend-only editor for title, body, and status.
- Selecting `Video` opens `MembershipVideoEditor`, a controlled frontend-only editor for title, description, local video file metadata, and status. Video selection uses `GalUppyFileUploader` in selection-only mode and does not perform a Membership upload request.
- Selecting `Resource` opens `MembershipResourceEditor`, a controlled frontend-only editor for title, description, local file metadata, and status. Resource selection uses `GalUppyFileUploader` in selection-only mode and does not perform a Membership upload request.
- Post, Video, and Resource create/edit/delete are frontend-only; they use local counter IDs and ISO timestamps, and they must not write to Product autosave or API payloads.
- Selecting `Existing Product` closes the chooser and requests that `MembershipIncludedProducts` open its existing `ProductPicker`; no second ProductPicker or duplicated product loading logic should be introduced.
- The current deterministic manual list order is feed-entry array order. There is no drag-and-drop, populated `position`, or persisted ordering contract yet.
- `MembershipIncludedProducts` owns Product summary loading and picker state. Included Product relationship state, add/remove behavior, and duplicate prevention are controlled by the lifted Membership builder state.

## Current Feature State

Implemented / reasonably wired:

- Auth signup, login, verify email, forgot password, Google sign-in hooks.
- Protected routes by role.
- Creator management shell with Dashboard, Products, Customers, Sales, Marketing, Storefront, and Settings destinations; Analytics and Help are visible as disabled planned destinations.
- Creator Dashboard redesign with business metrics, recent activity, top products, and needs-attention panels.
- Creator Products management redesign with local search/filter/sort, list/table desktop composition, mobile management cards, and distinct empty/loading/error states.
- Creator Customers management area with a customer list and dedicated customer detail route.
- Creator Sales management area with overview metrics, an orders ledger, local search/filter/sort/date preset controls, local pagination, responsive layout, empty/no-result states, and contextual order detail inspection.
- Product create/edit builder for course/download/consultation/membership basics.
- Membership builder integration with a Membership Content tab.
- Generic reusable Product Picker used by Membership included-product selection.
- Unified Membership content list foundation, inline `+ Add Content` chooser, and frontend-only Post/Video/Resource create/edit/delete flows.
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
- Creator Analytics and Help navigation destinations are disabled because implementations are not available yet.
- Creator Marketing route exists, but verify feature completeness before expanding it.
- Cart/wishlist exist mostly frontend-side/localStorage; persistence/checkout contract is not clearly backend-backed.
- Membership included products are limited to existing Course/Download products and held in frontend state only.
- Native Membership Post, Video, and Resource content have frontend-only create/edit/delete support. Native Video/Resource store selected local file metadata only and have no upload/persistence contract. No native Membership content has backend persistence.
- Membership recurring pricing has a frontend-only `RecurringPricing` model and `RecurringPriceSelector`; no backend Product pricing contract exists for it yet.
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
- Membership has no backend included-product relationship API yet.
- Membership has no backend native content API yet.
- Membership has no backend recurring pricing contract yet.
- Membership has no subscription/entitlement/member-access model yet.
- Creator Customers has no production customer list/detail API, purchase/order API, entitlement/access contract, subscription/customer membership-state contract, waitlist API, tags/notes persistence, production pagination contract, or manual access-management API yet.
- Creator Sales has no production order/payment/refund/subscription/entitlement services, provider-safe financial mutation contract, or server pagination contract yet.

Deliberate temporary implementations:

- `REACT_APP_USE_MOCKS` can load ignored local `src/core/api/_mocks.ts`.
- `REACT_APP_USE_MOCKS=true` also enables deterministic Creator visual-inspection data for authenticated Creator identity, Products, Dashboard, Customers, Sales, and frontend-only Membership inspection state. Production must not fake unsupported Creator business metrics, customer records, sales/order/payment records, or customer-domain states.
- Blank section/lesson drafts exist locally until enough data is present for backend creation.
- Creator Dashboard inspection fixtures live in `src/domains/app/pages/creator-specific/creator-dashboard/fixtures/dashboard-inspection-fixture.ts`. When mocks are off, Dashboard metric panels intentionally render unavailable business states rather than fabricated values.
- Creator Dashboard Top products rows currently navigate directly to Product Workspace edit routes (`/app/products/edit/{productId}`) because there is no Product Overview destination yet. Future Creator product-entity navigation should prefer Product Overview, with editing/building as a secondary action from that overview.
- Creator Products inspection fixtures currently come through ignored local mock data in `src/core/api/_mocks.ts` when mocks are enabled.
- Creator Customers inspection fixtures live under `src/domains/app/pages/creator-specific/customers` and are returned only when `REACT_APP_USE_MOCKS=true`. With mocks off, Customers renders honest unavailable states rather than fabricating customer business data. Fixture data must remain development/inspection infrastructure, not a production fallback.
- Creator Sales inspection fixtures live under `src/domains/app/pages/creator-specific/sales-page` and are returned only when `REACT_APP_USE_MOCKS=true`. With mocks off, Sales renders an honest unavailable state rather than fabricating order/payment/refund/access data. The `salesEmpty=true` query option and localStorage flag are inspection aids only, not production behavior.
- Download upload deduping is local to the section editor instance.
- Membership included-product selection, ordering mode, manual feed order, and feed metadata are local frontend state until a relationship/feed API exists.
- Membership native content state is local frontend state lifted above the Membership Content tab. Post, Video, and Resource can be created/edited/deleted locally; Video/Resource use selection-only local file metadata. Backend persistence remains undefined.
- Membership recurring pricing is local frontend state until a structured recurring pricing contract exists.

Speculative / verify before changing:

- Backend shape for lesson rich text, quiz payloads, video upload, checkout/cart, and storefront data.
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

Important fixture rule:

- The Dashboard is intentionally future-facing for visual inspection only. Metrics/business states not yet supported by production APIs may be represented by deterministic development-only fixture data when `REACT_APP_USE_MOCKS=true`.
- Production must not fake those values. With mocks off, the dashboard uses unavailable states from `unavailableDashboard`.

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

- Current Sales data comes from deterministic inspection fixtures returned only when `REACT_APP_USE_MOCKS=true`.
- The current frontend does not define production-backed contracts/services for complete Creator orders, payments, refunds, subscriptions, entitlements/access, provider-safe financial mutations, or server pagination.
- With mocks off, Sales renders an unavailable state rather than fabricated financial data.
- Do not introduce production APIs or financial mutation behavior merely to support the current inspection UI.

## Creator Products Management

The Creator product list is now a management page named `Products`, implemented under `src/domains/app/pages/creator-specific/products/products-list`.

Current implemented patterns:

- Desktop uses a compact list/table hybrid with Product, Status, Price, Updated, and Actions columns.
- Mobile transforms rows into management cards rather than shrinking the desktop table.
- Product identity/title is the primary navigation to Product Workspace (`/app/products/edit/{product.id}`).
- There are no permanent Edit buttons and no fake/permanent Publish buttons in the list.
- Overflow menus render only when meaningful secondary actions exist. Published products can expose Preview (`/app/product/{product.id}`); products with no secondary action do not render an ellipsis just for symmetry.
- Lifecycle status is shown with compact badges.
- Pricing is formatted as one-time EUR, Free, Price not set, or mock-only recurring Membership display where applicable.
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
- Product workspace navigation adapts on narrow screens while preserving the focused editing shell.

Avoid hardcoding viewport-specific pixel values into this document; inspect the SCSS breakpoints and component styles when implementing a responsive change.

## Recent / Unfinished Work

Recent Git history includes admin role/product ownership work, Membership frontend work, and the authenticated Creator redesign:

- Admin role management UI and role-based routing.
- Dev role switcher/backend role change support.
- Admin product management and create-for-creator flow using `ownerId` query param.
- Membership added as a first-class frontend Product type.
- Membership uses the shared builder shell, its own Membership Content tab, frontend-only Course/Download included-product selection, frontend-only Post/Video/Resource content creation/editing, and frontend-only recurring pricing controls.
- Creator management shell and IA centered on Dashboard, Products, Customers, Sales, Marketing, Storefront, plus Settings utility navigation; unavailable destinations such as Analytics and Help remain disabled.
- Creator Dashboard, Products, Customers, and Sales management visual redesigns.
- Focused Product Workspace shell for product editing.

Likely next steps:

- Polish/fix admin product owner filtering UX beyond raw owner ID.
- Complete product detail and storefront UI using real backend fields.
- Fix known warnings and cart removal bug.
- Verify product builder contracts for lesson content, quiz persistence, media upload, and consultation scheduling.
- Define backend contracts for Membership native content, included-product relationships, recurring pricing, subscription checkout, and entitlement/member access before persisting Membership-specific fields.
