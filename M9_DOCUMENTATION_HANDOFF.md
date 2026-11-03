# M9 Documentation Handoff — Profile Persistence & External Integration Feedback

M9 changes frontend behavior in Settings, Storefront profile editing, Product Landing Page editing, and Calendar Settings. The implementation follows the current UI/API contracts. Docusaurus and backend sources were not modified.

## Ticket changes

- **BUG-008 — Settings Profile validation and persistence:** Save now submits the React Hook Form form, including keyboard submission. Bio, Tagline/Mission, and Website constraints run before the existing `updateUserDetails` request. Supported name, title, bio, website, tagline, public email, and social-link fields persist through `PUT api/user/userInfo`; success is shown only after the request fulfills. Social handles are mapped to the existing `SocialMediaLink` URLs. Phone and profile-image controls are disabled because this update contract has no phone field or image-upload flow.
- **BUG-033 — Storefront retry recovery:** Profile updates now have operation-specific request identity, loading, and error state in the Auth slice. A pending profile save clears its prior profile error, successful completion clears the current error, and late mutation outcomes cannot replace newer state. This leaves unrelated authentication errors intact. Storefront inline editors continue to own their local failure feedback and stay open for retry.
- **BUG-052 — Landing Page rejection handling:** The Save click boundary catches thunk rejection, preserves the draft, and does not show success on failure. The Redux save state is request-owned. HTTP 403 and 404 failures receive safe permission/unavailable messages; other API failures receive a retryable generic message.
- **BUG-081 — Calendar initialization feedback:** Microsoft and Google use the same pending/error flow. Duplicate attempts are disabled while pending; failures retain the provider choice and can be retried. Only a valid HTTPS `authorizationUrl` is opened. OAuth response details are not logged or rendered. Consent, token exchange, synchronization, and production provider configuration were not exercised.
- **BUG-009 — Settings placeholder validation:** Subscription, Privacy, and Notification fields call their existing React Hook Form blur lifecycle and display associated local validation errors. Privacy now has the correct label. These forms remain local placeholders and do not claim preference persistence.

## Architecture and behavior boundaries

The profile mutation continues using the existing User API and Auth slice. Its request state is separate from authentication resolution and the generic Auth error, and is cleared at session boundaries. `PROJECT_CONTEXT.md` now records this convention, the Settings persistence boundary, and the frontend-only Calendar/placeholder boundaries.

Landing Page access control remains backend-owned. The frontend presents safe status-specific feedback but does not infer or bypass ownership. Calendar initialization remains separate from OAuth consent and calendar synchronization; tests stub `window.open` and use synthetic HTTPS URLs. Phone editing, profile-image upload, Subscription settings, Privacy settings, and Notification preferences remain unsupported by the current backend/UI contracts.

## Relevant implementation files

- Settings Profile and Calendar: `src/domains/app/features/settings/settings-tabs/settings-profile-tab.component.tsx`, `connected-calendar.component.tsx`
- Placeholder Settings forms: `settings-subscriptions-tab.component.tsx`, `settings-privacy-tab.component.tsx`, `settings-notifications-tab.component.tsx`
- Profile mutation state and selectors: `src/core/store/auth-store/auth.slice.ts`, `auth.selectors.ts`
- Landing Page save state and UI: `src/core/store/product-landing-page-store/product-landing-page.slice.ts`, `src/domains/app/pages/creator-specific/products/product-landing-page-builder/product-landing-page-builder.component.tsx`
- Storefront inline profile save lifecycle: `src/domains/app/pages/creator-specific/storefront-management-page/storefront-management-page.component.tsx`
- Calendar service logging boundary: `src/core/api/services/calendar/calendar-api.ts`
- Shared Settings header submit/loading support: `src/domains/app/components/page-header/page-header.component.tsx`

## Verification

Focused component and reducer tests cover Profile validation/success/failure, newest profile request ownership, Landing Page permission rejection/draft retention, Calendar failure/retry and invalid URL handling, placeholder blur validation, and Storefront failed-save retry. Calendar tests use a synthetic response and stub `window.open`; they do not initiate live OAuth. No browser-driven or live-backend E2E run was performed.

Final verification on this branch: `npm test -- --runInBand --silent` passed **125 suites / 848 tests**. The final targeted post-cleanup run passed **5 suites / 19 tests**, followed by a **3-test Profile rerun** after the final optional-email clearing adjustment. `npm run tsc` passed. Repository-wide `npm run lint` exited successfully with **185 warnings and no errors**; these are existing warnings in other source/test files. `REACT_APP_USE_MOCKS=false npm run build` completed successfully; webpack reported three bundle-size/performance warnings (2.82 MiB `bundle.js` and a 793 KiB image). The last build took 31 seconds, so the earlier silent build stalls were not reproduced here. `git diff --check` passed.

## Suggested Docusaurus follow-up

If the docs team updates the Settings guide, describe the server-backed Profile fields and validation limits, and identify phone/image edits as unavailable. Keep Subscription, Privacy, and Notification tabs explicitly marked as placeholders with local-only validation. Update Calendar guidance to say that Connect initializes provider consent and that consent/synchronization availability still depends on backend/provider deployment. Update the Product Landing Page troubleshooting guide to distinguish permission, unavailable-resource, and transient save failures. Do not document provider consent, calendar synchronization, profile image persistence, or placeholder preference persistence as verified capabilities.

## Remaining verification limits

The implementation used controlled local API fixtures only. No browser-driven run was performed. Deployed profile persistence across a reload, real authorization configuration, cross-origin Calendar behavior, real Microsoft/Google consent and callback handling, backend rejection ordering under simultaneous writes, and production permission behavior remain live-backend/deployed E2E checks.
