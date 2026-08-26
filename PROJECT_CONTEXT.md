# PROJECT_CONTEXT.md

Generated from repository state:

Branch: main
Commit: b9f5510

Last reviewed: 2026-08-13

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

Local API mocks are maintained source under `src/core/api/_mocks.ts` and `src/core/api/_mocks/`. With `REACT_APP_USE_MOCKS=true`, domain-specific mock registrations attach to the shared Axios client so UI code still follows Component → Redux/thunk → API service → shared client. The mock layer is a deterministic in-memory development backend for frontend-owned flows; state resets on full application reload.

Shared mock state owns the current Creator identity and canonical Products, including Product CRUD, owner/user product queries, summaries, search, Product presentation media, Course/Download sections, Course lessons, and Download file metadata. Product thumbnail upload uses the existing Product image endpoint; thumbnail removal, gallery images, and Product promo video use narrow backend-pending Product media endpoints in local mocks. Download file uploads use the normal presign → direct upload → confirm flow, but mock presigned URLs use a local `mock-upload://download-section/...` protocol that the shared upload helper short-circuits in mock mode because direct `fetch` storage PUTs cannot be intercepted by Axios Mock Adapter. This simulates the upload protocol without binary persistence or a new production contract.

Dashboard, Sales, Customers, Analytics, Storefront, and Product Landing Page config/read APIs are backend-supported. Their local mocks remain deterministic development fallbacks under `REACT_APP_USE_MOCKS=true`. Storefront config and public reads are stateful and derive Product identity from canonical Product mocks where appropriate. Product Landing Page config persists per Product ID with defaults for unsaved Products. Membership aggregate/config/content/feed mocks remain Product-scoped and must not be merged into generic Product DTOs.

Mock mode is intentionally strict: unmatched API requests return a local `501` with a clear “No local mock is registered” message instead of passing through to the real backend. Explicit exceptions should be registered as their own handlers. External Google OAuth is not simulated; calendar connect returns a mock-safe authorization URL placeholder rather than pretending to complete provider OAuth.

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
- Product private preview routes (`/app/products/:productId/preview`) are authenticated Creator/Admin management routes that render the shared customer-facing Product Landing Page presentation for Draft, Hidden, and Published Products. They are authenticated management previews and must not be treated as public visibility.
- Product builder routes (`/app/products/create`, `/app/products/edit/*`, and `/app/admin/products/create`) intentionally render outside `CreatorAppShell` so editing can use a focused product workspace.
- Routes can request the Creator sidebar collapse through `collapseSidebarOnLoad` route metadata. Product edit routes and the Storefront Builder use this existing shell/sidebar behavior.
- Marketplace/customer routes such as `/app/explore` still use the older `TopNavbar` shell; the marketplace Explore/Search experience is not part of the Creator management IA. The public Storefront route intentionally bypasses both Creator management chrome and the older marketplace chrome.

Current Creator IA:

- Functional Creator destinations: Dashboard (`/app`), Products (`/app/products`), Customers (`/app/customers`), Sales (`/app/sales`), Analytics (`/app/analytics`), Storefront (`/app/storefront`), Settings (`/app/settings`).
- Sales, Customers, Analytics, and Storefront are Creator-only routes. Admins should not be routed to those surfaces because the corresponding backend endpoints intentionally return `403`.
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

- Shared tabs: Basics, Pricing, Media, Readiness.
- Course section tab: Curriculum.
- Download section tab: Files.
- Consultation tab: Availability.
- Membership tab: Content.

Product Builder Redesign Phase 1 establishes the focused Product Workspace foundation without redesigning nested Product editors yet.

- The Product Workspace remains outside `CreatorAppShell` and uses `ProductWorkspaceShell` as the persistent focused editing shell.
- The header shows Back to Products, Product type/title, lifecycle status, autosave state, Preview, a minimal disabled overflow placeholder, and Publish.
- The frontend lifecycle model is `DRAFT → PUBLISHED ⇄ HIDDEN` using existing `ProductStatus`.
- Product editing remains autosave-first. Product autosave now exposes a narrow pending/flush contract so intentional workspace Back and Publish actions can flush debounced Product detail changes before continuing; if a flush fails, Back asks before leaving.
- Create remains two-step: `CreateProductStepOne` creates a backend `DRAFT` Product first, then replaces the route with `/app/products/edit/:id` so the Creator is editing a real Draft Product rather than staying on `/create`.
- Product-type-aware workspace navigation is centralized through `BuilderSidebar`/`getProductTabs`: Course uses Basics, Pricing, Curriculum, Media, Readiness; Download uses Basics, Pricing, Files, Media, Readiness; Consultation uses Basics, Pricing, Availability, Media, Readiness; Membership uses Basics, Pricing, Content, Media, Readiness.
- Each active destination renders in a consistent canvas hierarchy with a concise heading, supporting description, and the existing editor content. Nested editors such as `BasicInfo`, pricing controls, Course/Download sections, Consultation fields, Membership content, and media upload are intentionally not comprehensively redesigned in Phase 1.
- Readiness is now a stable workspace destination for every Product type. Membership reuses its existing readiness evaluator for known blockers/warnings. Other Product types show an honest readiness shell explaining that type-specific publish validation is pending for later Product Builder phases.
- Publish remains the intended MVP lifecycle action. Phase 1 keeps it first-class and routes known Membership blockers to Readiness, but the current temporary implementation still submits through the existing Product update flow rather than claiming production-complete publish/status validation.
- Preview is represented as the intended Creator-only preview of the customer-facing Product experience using current Product state, including Draft/Hidden Products. Phase 8A implements the authenticated frontend route for this behavior at `/app/products/:productId/preview`; production authorization/server-side preview read enforcement remains backend-owned.
- Desktop keeps persistent left workspace navigation and a wide editing canvas. Tablet/mobile adapt the existing builder navigation into a compact horizontal/tab-style workspace nav so shell chrome does not squeeze the editor.

Product Builder Redesign Phase 2 redesigns shared Product configuration only.

- Newly created Products now land on the Basics destination after the `/app/products/create` → `/app/products/edit/:id` route replacement, regardless of Product type.
- `BasicInfo` is the shared Product identity surface for Course, Download, Consultation, and Membership. It uses Product-type-aware name/description labels and shows Product type as read-only after Draft creation because type drives workspace structure and should not change in edit mode.
- Shared Pricing now lives in `ProductPricingSection` inside `src/domains/app/features/product-form`. Course and Download support Free or One-time pricing, Consultation supports One-time pricing, and Membership supports Recurring monthly/yearly pricing. The current Product model supports EUR only.
- Free pricing is represented by Product `price: 'free'`. Paid and recurring Products require a positive amount; empty or invalid paid input is treated as incomplete rather than silently becoming a valid zero-price Product.
- Membership recurring pricing still uses Product-owned backend-pending fields: `price`, `pricingModel`, `billingInterval`, and `currency`. Membership content, included Products, subscriptions, entitlements, and member access remain separate backend-pending contracts.
- Phase 2 does not redesign Course Curriculum, Download Files, Consultation Availability, Membership Content, Media, Readiness rules, Publish lifecycle validation, or private preview.

Individual product types share `ProductWorkspaceShell`, while their domain-specific editors remain separate inside `src/domains/app/features/product-form`.

Product Builder Redesign Phase 3 redesigns section-based Course and Download content management only.

- The shared Product Section architecture remains the grouping model: Courses present sections as Curriculum sections containing lessons, while Downloads present sections as Files file groups containing customer deliverables.
- Entity creation is explicit. Course/Download sections are created through an Add section/Add file group creation surface; Course lessons are created through an Add lesson surface with a required title and an MVP lesson type. Typing into blank rows no longer silently creates persisted sections or lessons.
- Course Curriculum now uses a scan-friendly hierarchy: compact section/group headers, compact lesson rows, visible lesson type text, local save/error feedback, and a shared Drawer for focused lesson editing so the outline stays readable.
- Supported MVP Course lesson types in the builder are Video, Article, and Quiz. `ASSIGNMENT` remains in the broader model but is not exposed as a Phase 3 MVP Course workflow.
- Course lesson editing persists supported fields through the current lesson service/state path. Article rich-text content maps to `CourseLesson.content` as serialized editor JSON. Quiz configuration uses the existing MVP quiz draft model and is carried through the frontend/mock lesson payload; production backend support for this payload still needs confirmation. Video lesson title/type/description and intended selected-asset state are represented, but durable Course video upload/storage remains backend-pending and must not be presented as a completed production upload contract.
- Course sections and lessons support Move up/Move down ordering using the existing `position` field. The UI updates immediately and attempts to persist moved entity positions through the existing section/lesson update paths.
- Course section and lesson deletion use inline confirmation. Section deletion copy makes clear that contained lessons are removed with the section; lesson deletion uses a concise destructive confirmation.
- Download Files uses Product sections as file groups with Download-specific language. File groups support create, rename, description, Move up/Move down ordering through section positions, and destructive confirmation.
- Download file upload keeps the production-shaped presign -> direct upload -> confirm lifecycle through `product-download-files-api`. Local mock mode simulates this lifecycle with `mock-upload://download-section/...` presigned URLs and preserves confirmed file metadata in canonical Product state. The UI shows compact file rows with file type, name, size, and upload status, and file removal requires confirmation.
- Download file ordering is upload-order-only in the current frontend/model. There is no persisted file position or renaming contract, so Phase 3 does not invent file reordering or file metadata editing.
- Nested content save state is local to sections, lessons, uploads, and destructive actions. Product header autosave remains Product-detail focused and should not be treated as a guarantee that nested content mutations succeeded.
- Phase 3 does not redesign Consultation Availability, Membership Content, Media, final Readiness rules, checkout/entitlements, private preview, publish validation, Course drip scheduling, free-preview lessons, certificates, student analytics, file renaming, or advanced quiz/question-bank behavior.

Product Builder Redesign Phase 4 redesigns Consultation Availability configuration only.

- Consultation remains inside the shared Product Workspace and uses Product-owned `consultationDetails`; there is no separate Consultation builder shell, store, or product-type-specific persistence endpoint.
- The Availability destination is now a structured settings surface with sections for Session, Weekly availability, Calendar, Scheduling rules, Client communication, and Cancellation.
- Session configuration supports the existing Meeting Method values: Zoom, Google Meet, Phone, and Other. The custom location/instructions field appears only for Other. Zoom and Google Meet are represented as intended delivery methods; automatic video-conference room creation remains integration/backend-pending.
- Weekly availability is modeled on `consultationDetails.weeklyAvailability` as day-level availability with enabled state and one or more `{ startTime, endTime }` windows. The frontend default for new Consultation Products is Monday-Friday 09:00-17:00 and weekends unavailable. This is a neutral frontend starting configuration, not backend business logic.
- Weekly availability validation is local to the Availability UI: enabled days require at least one range, start must be before end, and overlapping ranges are surfaced as errors. The Product Builder still does not implement the customer booking engine or final Readiness blockers.
- Scheduling rules group existing Product-owned Consultation fields: buffer before, buffer after, and maximum sessions per day.
- Client communication owns the existing confirmation message as customer-facing post-booking copy. The builder does not claim automated email delivery.
- Cancellation uses the existing cancellation policy options and remains Product-owned configuration. Cancellation execution, refunds, rescheduling, no-show handling, and appointment management are outside Phase 4.
- Calendar integration is account-owned today. The Product builder displays connected calendar state from `consultationDetails.connectedCalendars` when present and routes Creators to `/app/settings?tab=calendar` to manage account-level calendars. There is no Product-level calendar selection contract yet. Calendar OAuth remains external/backend-pending; mock mode keeps the existing mock-safe authorization placeholder convention.
- Mock mode supports Consultation availability persistence through the generic Product PATCH/GET flow. The new weekly availability fields are frontend/backend-pending production contract fields carried in the Product payload and preserved by local mocks.
- Future customer booking-slot computation remains backend/customer-flow work that must combine weekly availability, connected calendar busy time, duration, buffers, maximum sessions per day, and existing bookings.
- Phase 4 does not redesign Membership Content, Media, final Readiness/Publish, private Preview, customer booking UI, checkout/payment, appointment management, reminders, date-specific exceptions, holidays/time off, timezone selection, group sessions, round-robin scheduling, or advanced booking notice/window rules.

Product Builder Redesign Phase 5 redesigns Membership Content only.

- Membership remains inside the shared Product Workspace. Basics and recurring Pricing are Product-owned; Membership content, included-product relationships, feed ordering, and native Membership content CRUD stay in the separate Membership domain contracts/store.
- The Content destination is now a compact Membership content hub with a unified feed, clear empty state, semantic status badges, and a primary `+ Add content` action. It does not introduce a separate Membership builder shell.
- Add Content uses the shared Drawer pattern. Creators can add native Post, Video, or Resource content, or include an existing Course/Download Product. The chooser and editors are contextual workspace interactions rather than full destinations.
- Native Post, Video, and Resource editors are controlled drawer editors with inline validation and localized operation errors. Invalid saves reveal field-specific errors; save failures keep the draft open for retry.
- Video and Resource selection remains metadata-only through `UppyFileUploader` selection mode. Durable Membership media upload/storage and reusable asset lifecycle are still backend/Media-phase pending, so the UI must not claim production binary persistence.
- Included Products are limited to existing Course and Download Products. They remain standalone Products represented in the Membership feed by Product-ID associations; removing an included Product removes only the Membership relationship and never deletes the original Product.
- Feed ordering remains Membership-owned. `NEWEST_FIRST` derives display order from Membership feed `addedAt`; `MANUAL` persists explicit feed positions and exposes accessible Move up/Move down controls.
- Native content deletion and included-product removal use inline confirmations with explicit copy. Destructive action errors are shown locally and do not roll back unrelated Product draft state.
- Membership mutations run through Membership Redux thunks/services and local HTTP mocks, not Product autosave payloads. Product header autosave remains Product-detail focused; Membership operations surface their own pending/error states.
- Mock mode supports Product-scoped Membership aggregate/config/content/feed round trips for the redesigned hub. Components still follow Component → Redux → thunk → Membership service → Axios → backend or ignored local HTTP mock, with no component-level mock branching.
- The hub is responsive: desktop uses dense scannable feed rows and drawer editors, while mobile stacks row metadata/actions and relies on the shared Drawer mobile treatment.
- Accessibility expectations include labeled chooser/editor controls, semantic status labels, named edit/delete/remove/move actions, dialog semantics from `Drawer`, inline validation tied to controls where shared fields support it, and confirmation surfaces that do not rely on color alone.
- Phase 5 does not redesign Media, final Readiness/Publish, private Preview, customer Membership pages, subscription checkout, entitlements/access, appointment/customer booking flows, or production Membership media upload.

Product Builder Redesign Phase 6 redesigns Product Media only.

- Media remains a shared Product Workspace destination for Course, Download, Consultation, and Membership. It owns Product presentation media only: the Product thumbnail, optional Product gallery images, and optional Product-level promo video.
- Product Media explicitly does not own Course lesson videos/assets, Download deliverable files, Membership Video/Resource entries, Storefront profile images, Landing Page configuration, or reusable account-level media library assets.
- The thumbnail flow uses the existing `POST api/products/image?productId=...` upload path and updates canonical Product `imageUrl` in Redux/form state after upload. Thumbnail removal uses a narrow backend-pending `DELETE api/products/image?productId=...` contract and is supported by local mocks.
- Gallery images are modeled as Product-owned `galleryImages` with ID, URL, file metadata, position, optional alt text, and upload/processing status. Gallery add/remove/reorder use backend-pending Product media endpoints under `api/products/:productId/media/gallery` and are preserved by local mocks.
- Product promo video is modeled as an optional Product-owned `promoVideo` with ID, optional URL, file metadata, status, and optional thumbnail URL. It is customer-facing presentation media, not Course or Membership content. Promo video add/remove use backend-pending Product media endpoints under `api/products/:productId/media/promo-video` and are preserved by local mocks.
- The Media destination has structured sections for Thumbnail, Gallery, and Promo video, with upload status, inline operation errors, empty states, preview surfaces, and accessible named actions. It uses the existing Uppy wrapper for file selection.
- Product Landing Page consumes canonical Product media directly. Ready gallery images and a READY promo video are rendered in the shared landing page presentation when present. Landing Page config does not copy media fields.
- Storefront continues to consume canonical Product thumbnail/image data for Product cards; gallery and promo video are not duplicated into Storefront config.
- Product media operations are immediate Product-owned mutations, not generic Product detail PATCH/autosave snapshots. Header autosave remains Product-detail focused; section/lesson/download/membership/media operations report their own local pending/error state.
- The shared upload lifecycle helper exists only to avoid duplicating direct-storage upload behavior and mock-protocol short-circuiting. It does not create a reusable Media Library, video transcoding pipeline, or production binary storage contract.
- Mock mode supports create Product -> configure Media -> fetch Product again with thumbnail/gallery/promo state retained. Mock media URLs and statuses are local development behavior; production persistence for gallery, promo video, and thumbnail removal remains backend-pending.
- Phase 6 does not redesign final Readiness/Publish, private Preview, customer checkout/access, Course lesson media persistence, Download file management beyond compatibility with the shared upload helper, Membership durable binary media upload, Storefront profile media, contextual one-off media inside other editors, or a reusable Media Library.

Product Builder Redesign Phase 7 implements Readiness and temporary Publish behavior for the MVP Product Workspace.

- Readiness is now a shared Product Builder architecture under `product-readiness`, with pure deterministic evaluators that return blockers, warnings, ready state, and evaluating/loading state. The same evaluator feeds the Readiness destination and the Publish action.
- Blockers prevent frontend Publish. Warnings are shown separately and never block Publish. Ready state means the current frontend checks passed; it does not imply server-side validation has run.
- Shared blockers require a trimmed Product name and Product-type-valid pricing. Course and Download support Free or positive one-time pricing; Consultation requires a positive one-time price; Membership requires positive recurring pricing with monthly or yearly billing.
- Shared warnings include missing Product thumbnail. Gallery images and promo video remain optional presentation media.
- Course readiness requires at least one section and at least one lesson. It does not claim durable Course video media readiness because Course lesson binary persistence remains backend-pending.
- Download readiness requires at least one persisted/confirmed file object across Download file groups. Empty file groups do not make a Download ready.
- Consultation readiness requires valid duration, meeting method, custom location/instructions when meeting method is Other, at least one valid weekly availability range, and no invalid/overlapping availability ranges. Missing connected calendar is a warning only because account calendar integration is not required for production Publish yet.
- Membership readiness uses the shared evaluator with Membership aggregate/content/feed inputs. It requires valid recurring pricing and at least one published native content item or published included Product. Draft native content is a warning. Published Membership Video/Resource items carry an honest backend-pending durable-media warning when present.
- Readiness issue actions navigate to existing Product Workspace destinations: Basics, Pricing, Curriculum/Files, Availability, Content, and Media. No issue-specific routes were introduced.
- Publish first flushes pending Product autosave through `flushAutosave()`, then reuses the shared readiness result. If blockers exist or required Membership readiness data is still loading, Publish selects Readiness and shows inline feedback instead of using `window.alert`.
- If no blockers exist, Publish uses the current temporary Product update architecture to PATCH the Product with `status: PUBLISHED`. The workspace header reflects the updated status after persistence. Already-published Products show a non-active Published state; Unpublish is not implemented.
- Publish state prevents duplicate requests and surfaces retryable inline errors on failure without changing local status falsely.
- Backend Publish remains future-authoritative for lifecycle transitions, server-side validation, persisted nested-content readiness, billing readiness, entitlement/access readiness, media readiness, and cross-resource invariants. The frontend evaluator is Creator guidance and immediate UX only.
- Phase 7 does not implement Unpublish, scheduling, approvals, backend Publish endpoints, checkout, entitlement/access execution, billing execution, Course media expansion, Membership media expansion, Media Library, or broad final cleanup. Private Draft/Hidden Preview is implemented separately in Phase 8A.

Product Builder Redesign Phase 8A implements Private Preview only.

- The focused Product Workspace Preview action now opens `/app/products/:productId/preview` for any saved Product ID, including `DRAFT`, `HIDDEN`, and `PUBLISHED` statuses. Unsaved/create-step Products still cannot preview until a Product ID exists.
- The private preview route is protected by the existing Creator/Admin products route boundary and reuses the shared `ProductLandingPage` presentation. It does not create a separate preview renderer or duplicate landing-page presentation logic.
- Private preview loads canonical Product data through the authenticated Product read path, creator Product Landing Page config through the creator config thunk, and Creator Storefront theme/profile context through the Creator storefront config/current user path. It intentionally does not call public Storefront or public Product Landing Page config endpoints.
- Draft and Hidden Products render in private preview without changing the public `/app/product/:id` guard. Public Product pages still require `PUBLISHED` frontend visibility and must eventually be backed by server-enforced public visibility.
- The preview wrapper adds creator-only chrome with Product lifecycle status and a Back to workspace action. This chrome lives outside the shared landing-page presentation so customer-facing rendering remains reusable.
- Product Overview keeps `View public page` as a published-only action. It does not use the private preview route for public visibility.
- Phase 8A does not implement final Product Builder polish/refinement, mobile-specific preview tooling, customer checkout/access, entitlement logic, preview share links, public visibility backend enforcement, or production preview authorization beyond the current authenticated frontend route boundary.

## Product Overview V1

Creator/Admin Product Overview is the management home for one Product. Route separation is intentional:

- Product Overview: `/app/products/:productId`.
- Focused Product Workspace: `/app/products/edit/:id`.
- Legacy/type-bearing Product Workspace path: `/app/products/edit/:type/:id`.
- Private Product Preview: `/app/products/:productId/preview`.
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
- Explicit workspace `Preview` actions should navigate to the authenticated private Product Preview route.

This principle currently applies to Creator Products list identities, Creator Dashboard product destinations, Creator Analytics product ranking rows, and Creator Sales product identity links in the ledger and Order Detail. Explicit edit/build actions, such as `Edit product`, builder CTAs, Dashboard attention actions that mean "fix/edit this product", and Admin explicit Edit actions, remain Product Workspace links.

## Product Landing Page V2 Foundation

Public Product Landing Page V2 replaces the legacy placeholder-heavy `ProductPage` presentation behind `/app/product/:id` and `/app/product/:id/:type`.

Current route separation:

- Creator Product Overview: `/app/products/:productId`.
- Creator Product Landing Page Builder: `/app/products/:productId/landing-page`.
- Creator Private Product Preview: `/app/products/:productId/preview`.
- Focused Product Workspace: `/app/products/edit/:id` and `/app/products/edit/:type/:id`.
- Public Product Landing Page: `/app/product/:id`; `/app/product/:id/:type` remains a compatibility path that redirects to the canonical ID-only path when the type segment does not match the loaded Product.

Product Overview, Product Landing Page Builder, and Private Product Preview render within the Creator management route architecture. Product Workspace remains the focused editing workspace outside the normal Creator shell. The public Product route owns route params, loading/error/unavailable states, temporary data composition, public visibility checks, and compatibility redirects. It renders the shared `ProductLandingPage` presentation under `src/domains/app/features/product-landing-page`. The authenticated Creator Product Landing Page Builder and Private Product Preview reuse the same shared presentation; Creator-only editing/preview chrome lives around the shared renderer, not inside it.

Current Product Landing Page data boundary:

- The public route, Creator builder, and private preview still use the existing Product service → `getProductById` thunk → Product Redux `currentProduct` path as a temporary frontend source for canonical Product data.
- The shared presentation consumes a narrow Product Landing Page view model rather than Redux, route params, or raw Product service responses directly.
- The route clears stale `currentProduct` before loading a route Product ID and only composes the landing page when the loaded Product ID matches the route ID.
- Product Landing Page config is a narrow backend-supported domain under `src/core/api/models/product-landing-page`, `src/core/api/services/product-landing-page`, and `src/core/store/product-landing-page-store`. Current runtime path is Component → Redux thunk → Product Landing Page service → Axios → production backend or ignored local HTTP mock. Components must not branch directly on `REACT_APP_USE_MOCKS`.
- Current service shapes are `GET api/products/:productId/landing-page` for public-safe config reads and `GET`/`PATCH api/creator/products/:productId/landing-page` for authenticated Creator reads/writes. Local ignored HTTP mocks support these endpoints under `REACT_APP_USE_MOCKS=true` as development fallbacks.
- Explicit `visibleSections: []` is preserved as an intentional empty selection; default sections are applied only when `visibleSections` is absent.
- A dedicated public Product read model remains a future backend requirement. That future read model should provide public-safe Product fields, public Creator presentation, persisted landing-page configuration, public visibility enforcement, and checkout/access availability without requiring the buyer-facing route to orchestrate internal Product/User/Storefront reads.

Current public Product Landing Page behavior:

- Renders only `PUBLISHED` Products as public Product pages. `DRAFT` and `HIDDEN` render an unavailable/not-found-style public state. This frontend guard is not a security boundary; production enforcement still belongs in the future public Product read contract.
- Uses real Product-owned data: Product type, name, description, price, recurring pricing metadata where present, thumbnail/image, and loaded type-specific content.
- Removes legacy fake Product page claims such as hardcoded creator name, fake ratings/review/customer counts, fake language, fake durations, placeholder includes, hardcoded short description, placeholder-only image behavior, inert `Buy Now`, and inert `Add to Cart`.
- Shows honest purchase/access states. Paid Commerce checkout exists for supported non-Membership Products, while Membership checkout, subscription checkout, entitlement/access, and waitlist capabilities remain unavailable.
- Inherits the Creator Storefront theme when an existing real Storefront/theme source is available through current frontend architecture; otherwise it falls back to `DEFAULT_STOREFRONT_THEME`. Product-specific theme overrides are not implemented, and this inheritance affects the public Product presentation/Builder preview rather than Creator management chrome.
- Applies persisted public-safe Product Landing Page config when available, including marketing description, hero layout, supported secondary section visibility, and supported secondary section order. It must still render safely without depending on a Creator-only endpoint.
- Renders real Creator identity only when available from the existing public Storefront read model or from current authenticated owner profile state. Anonymous/public creator identity must eventually come from the dedicated public Product read model.

Current private Product Preview behavior:

- Route `/app/products/:productId/preview` is authenticated for Creator/Admin users and is launched from the Product Workspace Preview action.
- Draft, Hidden, and Published Products can render in private preview once they have a Product ID. This does not make Draft/Hidden Products public.
- Creator-owner preview loads authenticated Product data, creator Product Landing Page config, Creator Storefront theme config, and current authenticated user profile data, then maps them into the shared `ProductLandingPage` view model.
- Administrator preview uses the Product owner's public Storefront data/theme when available and falls back to defaults rather than calling the Creator-only Storefront endpoint.
- The preview intentionally avoids public Product Landing Page config and avoids the Creator-only Storefront endpoint for non-owner previews so preview availability is not coupled to customer/public visibility or Admin access to Creator-only APIs.
- The preview wrapper shows lifecycle status and a Back to workspace action. Loading, unavailable, and config/storefront load errors are handled in the wrapper rather than inside the shared landing-page presentation.

Type-specific public summaries:

- `COURSE`: module/section count, lesson count, curriculum outline, lesson titles, and lesson types from loaded Product sections.
- `DOWNLOAD`: section count, file/resource count where loaded, section outline, and file names only. It does not expose storage URLs or technical file metadata.
- `CONSULTATION`: public-relevant configured details such as duration, meeting method, session buffers, daily availability, confirmation/cancellation messaging, and connected calendar availability when present.
- `MEMBERSHIP`: conservative Product-owned Membership positioning and recurring pricing only. It does not claim member counts, subscriber counts, revenue, entitlement state, or Membership feed details.

Creator Product Landing Page Builder current behavior:

- Route `/app/products/:productId/landing-page` is authenticated for Creator/Admin users and is launched from Product Overview via `Edit landing page`.
- The builder loads canonical Product data, loads the Product Landing Page config, creates a local draft, and maps Product + draft config + Creator/theme inputs into the shared `ProductLandingPage` preview.
- Draft edits update the live preview immediately and do not PATCH individually. The `Save` action persists the full landing-page config through the backend-supported Creator config service; `Reset` restores the last persisted config/default normalization. Unsaved state is surfaced by enabled/disabled Save/Reset actions, save loading state, and success/error status copy.
- Config owns only `marketingDescription`, `heroLayout` (`MEDIA_RIGHT`/`MEDIA_LEFT`), supported secondary-section visibility (`ABOUT`, `CONTENTS`, `CREATOR`), and supported secondary-section order for those IDs.
- Current customization capabilities are limited to additional marketing/about copy, hero media side/layout, supported secondary-section visibility, and supported page-section order. The Builder reorders page sections, not Course modules, Download files, Consultation fields, or other Product content entities.
- Desktop Builder customization uses a compact controls panel beside the live preview; mobile customization uses the shared `Drawer` infrastructure.
- Authenticated Builder can render non-public Product states for editing and displays Product status context. Editing a Draft/Hidden Product landing page does not make it publicly available and does not add a publish workflow.
- Product-owned fields such as name, description, type, status, price, pricing model, currency, thumbnail, and type-specific content remain read-only here and should be edited through Product Workspace.
- User/Profile-owned Creator display fields and Storefront/theme ownership are not duplicated into Product Landing Page config. Product-specific theme overrides are intentionally not part of Task 2.

Product Landing Page V2 now consumes canonical Product presentation media when available: thumbnail/image, ready Product gallery images, and a READY Product-level promo video. It intentionally does not implement slideshows, media upload inside the Landing Page Builder, reusable asset library, checkout, Stripe/PayPal, free Product fulfillment, Membership subscriptions, waitlists, entitlement/access, reviews/ratings, Product analytics, SEO, slugs/custom domains, arbitrary page-builder blocks, or new production backend APIs.

Intentional model decisions:

- Product union types live in `src/core/api/models/product`.
- `AbstractProduct` is a discriminated union of course/download/consultation/membership.
- `ProductDraft` allows incomplete frontend state before backend persistence.
- `mapFormDataToProductPayload` maps drafts to backend payloads and keeps unsupported product types explicit. Membership maps only shared Product fields and Product-owned recurring pricing metadata.
- Product normalizers handle backend `details` payload shape for sections and consultation details. Membership-specific state loads through the separate Product-scoped Membership contracts, not Product `details`.
- Product type metadata is centralized in `src/core/constants/products.ts` and drives create options, basic info options, filters, headers, and type metadata.

Membership content architecture:

- Native Membership content is modeled under `src/domains/app/features/product-form/membership-content/models` for UI/domain helpers and under `src/core/api/models/membership` for Membership API DTOs.
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
- Selecting `Video` opens `MembershipVideoEditor`, a controlled editor for title, description, selected video file metadata, and status. Video selection uses `UppyFileUploader` in selection-only mode; selected metadata may be saved, but the binary file is not uploaded or delivered to members.
- Selecting `Resource` opens `MembershipResourceEditor`, a controlled editor for title, description, selected file metadata, and status. Resource selection uses `UppyFileUploader` in selection-only mode; selected metadata may be saved, but the binary file is not uploaded or delivered to members.
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
- Creator Product Landing Page Builder at `/app/products/:productId/landing-page` with shared `ProductLandingPage` live preview, local Save/Reset draft behavior, and backend-supported config contracts for marketing description, hero layout, and supported secondary-section visibility/order.
- Creator Private Product Preview at `/app/products/:productId/preview` with shared `ProductLandingPage` rendering for Draft, Hidden, and Published Products behind Creator/Admin auth, while the public Product route remains `PUBLISHED`-guarded.
- Product create/edit builder for course/download/consultation/membership basics.
- Product Workspace Phase 1 shell/navigation redesign with lifecycle status, autosave/pending-save feedback, Product-type-aware Readiness destination, Preview/Publish foundations, and create-to-edit route replacement after Draft creation.
- Product Workspace Phase 2 shared configuration redesign for Basics and Pricing, including read-only Product type in edit mode and Product-type-specific Free/One-time/Recurring pricing rules.
- Product Workspace Phase 6 Media destination for Product-owned presentation media: thumbnail upload/removal, Product gallery images, and Product-level promo video. Product Landing Page consumes ready canonical Product media; Storefront continues to consume canonical Product thumbnails.
- Product Workspace Phase 7 shared Readiness destination and temporary Publish flow for Course, Download, Consultation, and Membership, including blocker/warning semantics, autosave flush before Publish, inline publish errors, duplicate-submit prevention, and Product status update to `PUBLISHED` through the existing Product update path.
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
- Public Product Landing Page still uses the existing Product read path as a temporary source. Product Landing Page config has backend-supported frontend contracts, Redux state, and ignored local HTTP mocks, but a dedicated production public Product read model, public creator payload, server-enforced visibility, and waitlist state remain unimplemented.
- Membership included products are limited to existing Course/Download products and persist as Membership feed Product-ID associations through Product-scoped Membership contracts.
- Native Membership Post, Video, and Resource content have frontend contracts, services, Redux state, and ignored local HTTP mocks. Native Video/Resource selection may save metadata/asset references only; binary upload and member delivery remain unavailable.
- Membership recurring pricing is Product-owned via Product pricing fields: `pricingModel`, `billingInterval`, and `currency`, with Product `price` as the amount source of truth. Subscription billing is unavailable.
- Product gallery images, Product promo video, and Product thumbnail removal have frontend/backend-pending Product media contracts, services, Redux state, and ignored local HTTP mocks. Existing thumbnail upload uses the established Product image endpoint. Production storage/transcoding/processing contracts for gallery and promo video still need backend confirmation.
- Publish currently uses a frontend Product status update through the generic Product PATCH path after frontend readiness checks pass. A production backend Publish contract is still required and must revalidate nested content, billing, entitlements/access, media, lifecycle authorization, and other cross-resource invariants.
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
- Membership has frontend contracts, services, Redux store integration, and ignored local HTTP mock responses for Product-scoped aggregate/config, native content CRUD, and feed/included-product associations. Membership publishing and checkout remain disabled.
- Product recurring pricing has frontend model/form support for Membership metadata, but subscription billing is unavailable.
- Membership Video/Resource binary asset upload and member delivery are unavailable; the existing Download section upload flow is section-scoped and should be generalized or adapted before claiming real Membership media delivery.
- Membership has no subscription, entitlement, or member-facing access model yet.
- Creator Customers has backend-supported frontend contracts, services, Redux store integration, and HTTP mock responses for read-only list/detail data. Editable CRM actions, notes/tags persistence, and manual access-management contracts are intentionally not implemented.
- Creator Sales has backend-supported frontend contracts, services, Redux store integration, and HTTP mock responses for summary, orders ledger, and order detail data. Provider-safe financial mutations, refund/payment retry actions, subscription management, and entitlement mutation contracts are intentionally not implemented.
- Creator Analytics has backend-supported frontend contracts, services, Redux store integration, and HTTP mock responses for aggregate overview data. Traffic, attribution, conversion, engagement, payout, cohort, and custom date-range analytics are intentionally not implemented.
- Creator Storefront has backend-supported frontend contracts, services, Redux store integration, and HTTP mock responses for the public read model and Creator configuration. Arbitrary page-builder blocks, custom-domain, SEO, and Storefront analytics contracts are intentionally not implemented.

Deliberate temporary implementations:

- `REACT_APP_USE_MOCKS` can load ignored local `src/core/api/_mocks.ts`.
- `REACT_APP_USE_MOCKS=true` also enables deterministic Creator visual-inspection data for authenticated Creator identity, Products, Dashboard, Analytics, Storefront, and Membership. Customers, Sales, Analytics, Dashboard, Storefront, and Membership use Redux/services/Axios and receive deterministic data from ignored local HTTP mocks rather than feature-level fixture branches. Production must not fake unsupported Creator business metrics, customer records, sales/order/payment records, analytics aggregates, storefront configuration, membership content/feed state, or customer-domain states.
- Blank section/lesson drafts exist locally until enough data is present for backend creation.
- Creator Dashboard uses a backend-supported frontend contract, service, Redux store integration, and ignored local HTTP mock response for the aggregate summary.
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
- Backend/runtime support for Membership publishing, checkout, subscriptions, entitlements, member-facing access, and Video/Resource binary delivery.
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

- The Dashboard is a backend-supported aggregate read model for the currently implemented summary metrics, recent activity, top products, and needs-attention panels.
- Do not invent Dashboard metrics or business states beyond the current read model. Local deterministic data exists only behind ignored HTTP mocks when `REACT_APP_USE_MOCKS=true`.

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
- Sales Orders support authoritative multi-Product `items[]`; each item carries Product identity, line amount, and its own access result.
- Singular `product` and top-level `access` are compatibility fields only. When `items[]` is present, Sales list/detail UI renders the item list rather than merging or trusting stale singular fields.
- The Order Detail drawer is read-only. It can show order amount/type/date, customer, itemized products, payment facts, order summary, item access outcomes, subscription context, refund context, and failed-payment context when data contains those fields.
- Sales explains access consequences but does not expose entitlement grant/revoke controls.
- Sales shows subscription context for recurring Membership charges but does not expose subscription-management actions.
- Sales does not currently include charts, analytics, payouts, invoices, tax reporting, disputes, export tooling, refunds-as-actions, manual retries, or provider administration.

Important Sales boundary:

- Current Sales read data flows through backend-supported frontend contracts/services/Redux and Axios. Local deterministic data exists only behind ignored HTTP mocks when `REACT_APP_USE_MOCKS=true`.
- The current frontend defines read contracts for Sales summary, Orders page, and Order detail, but does not define provider-safe financial mutations, refund/payment retry actions, subscription management, or entitlement mutation contracts.
- Do not introduce production APIs or financial mutation behavior merely to support the current inspection UI.

## Creator Analytics

The Creator Analytics area is implemented under `src/domains/app/pages/creator-specific/creator-analytics` and is the Creator-facing surface for inspecting aggregate business performance across revenue, orders, customer growth, memberships, product performance, and payment health.

Routes and shell integration:

- Analytics workspace: `/app/analytics`.
- The route is protected for Creator users only.
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

- Current Analytics read data flows through a backend-supported frontend contract/service/Redux and Axios. Local deterministic data exists only behind ignored HTTP mocks when `REACT_APP_USE_MOCKS=true`.
- The current frontend defines the `api/creator/analytics/overview` read contract with 7d/30d/90d period queries. Backend confirmed no Analytics response-shape changes are required for the current UI.
- Mock totals and comparisons are local visual-inspection values and are not product contracts. Do not preserve specific mock revenue/order/customer/membership numbers as meaningful behavior in documentation or tests unless a test is explicitly covering deterministic inspection rendering.
- Do not infer traffic, conversion, attribution, payout, tax, course-engagement, cohort, custom date-range, or other analytics capabilities from the current page.

## Creator Storefront

Storefront V2 is split between an authenticated Creator-only Storefront Builder and a public customer-facing Storefront. Both routes share Storefront view-model utilities and the `StorefrontPublicPage` presentation under `src/domains/app/features/storefront`.

Routes and shell integration:

- Creator-only Storefront Builder: `/app/storefront`.
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
- `publicEmail` is User/Profile-owned. The Storefront view model exposes email only when `publicEmail` is explicitly configured; login/account email is not used as a public fallback. Settings and Storefront share the same public-email concept and the same info-popover copy: "This is the email shown on your storefront. It can be different from the email you use to sign in."
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

- The public Storefront route uses the backend-supported `api/storefronts/:creatorId` read-model contract through Redux/services/Axios. The backend returns public creator presentation fields, public products, featured product ID, and persisted theme so the buyer-facing page does not orchestrate User, Product, and Storefront config requests.
- Creator Storefront Builder uses the backend-supported `api/creator/storefront` config contract through Redux/services/Axios. The config owns only `theme`, `featuredProductId`, and `productOrderIds`, and the route remains Creator-only because the backend intentionally returns `403` for Admin callers.
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

- Creator Customers read APIs are backend-supported for the current list/detail surfaces.
- Customer access can include `free` access source values, displayed as `Free enrollment`.
- Access state must not imply grant/revoke controls until backend access-management contracts exist.
- Notes/tags must not imply editable CRM persistence until a notes/tags API exists.
- Do not infer fake CRM actions, fake communication features, fake persistence, fake access management, or speculative customer operations from the UI.
- Local deterministic Customer fixtures are gated behind `REACT_APP_USE_MOCKS=true`; production must not fabricate unsupported Customer business data.

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
- Define the production public Product read model so `/app/product/:id` can stop orchestrating internal Product/User/Storefront reads and can rely on server-enforced public visibility.
- Define separate Storefront contracts before adding arbitrary page-builder blocks, custom domains, SEO, or analytics.
- Fix known warnings and cart removal bug.
- Verify product builder contracts for lesson content, quiz persistence, media upload, and consultation scheduling.
- Define backend/runtime support for Membership publishing, checkout, subscriptions, entitlements, member-facing access, and Video/Resource binary delivery before enabling those capabilities.
