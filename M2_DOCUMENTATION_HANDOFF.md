# M2 documentation handoff

Implementation branch: `codex/m2-saved-workspace-authoring-integrity`, developed on main `12765d4` and finalized on current main `52413ed` (merged M1, PR #71).
Suggested PR title: **Fix saved product workspaces and authoring integrity**.

No Docusaurus files were edited. After implementation review, synchronize the existing Product builder/authoring documentation in video-platform-docs with these behaviors:

- Saved Course, Download, Consultation and Membership workspaces now pass through loading/error states without changing React hook order. Creation remains two-step; existing canonical and supported legacy entry paths remain in the shared Product builder.
- Reopening an Article uses the latest body and formatting. Opening without an edit does not itself autosave a body. Active typing remains local; ordinary parent updates do not reinitialize Tiptap. Unsupported structured content is retained and shown with an explicit unsupported-format message. The separate Article reader defect (BUG-021) is unchanged.
- Section and Lesson edits use a two-second debounce and serialize writes per entity. Tabs wait for pending nested writes; Products, Preview and Publish wait for nested writes and Product detail flush. While waiting, the workspace reports Saving changes before continuing. Failures keep the current editor and dirty content available with retry feedback. Retry saving saves in place, after which the user can choose navigation again.
- Reordering uses the same nested autosave queue. Entity deletion waits for relevant nested writes. Product header status is still not a guarantee that uploads or every independent Membership/media operation succeeded.
- Browser unload/hard refresh has best-effort unsaved-change warning. Do not promise asynchronous persistence during browser termination, or awaited blocking of browser-history/forced routing with the current BrowserRouter.
- Membership aggregate failures settle into a stable error in Content. Retry Membership load explicitly retries; unrelated rerenders and tab switches do not retry. Request state and results are scoped to the selected Product identity.

Preserve all MVP boundaries: Product details, Sections, Lessons and Membership have separate payloads/APIs; no backend endpoints were added. Membership publishing, checkout, subscriptions, entitlements, member access and binary Video/Resource upload/delivery remain unavailable. Course binary video persistence remains backend-pending. No reader-rendering or general query-freshness work is included.

M1 is inherited from current main, not duplicated in this PR. The workspace integration suite now uses M1's real guard, root reducer, session middleware and HTTP interceptors. It verifies pending Section/Lesson drafts survive recoverable profile outages and retry, and an old-session nested save cannot restore account-owned state or navigate a new account after logout/account change. Live-backend cookie/session ordering, role-change journeys and real persisted authoring still require E2E verification. Previous synthetic browser checks used intercepted HTTP and disposable fixtures on the original M2 baseline; those checks were not rerun after integrating current main.

## Files changed

- `M2_DOCUMENTATION_HANDOFF.md`
- `src/domains/app/features/product-form/hooks/nested-autosave-context.ts`
- `src/domains/app/features/product-form/hooks/use-nested-autosave.hook.test.tsx`
- `src/domains/app/features/product-form/hooks/use-nested-autosave.hook.ts`
- `PROJECT_CONTEXT.md`
- `src/core/store/membership-store/membership.slice.test.ts`
- `src/core/store/membership-store/membership.slice.ts`
- `src/core/store/session.middleware.test.ts`
- `src/domains/app/features/product-form/course-lessons/course-lessons.component.tsx`
- `src/domains/app/features/product-form/create-product-sections/create-product-sections.component.tsx`
- `src/domains/app/features/product-form/editors/lesson-editor/lesson-editor.component.tsx`
- `src/domains/app/features/product-form/editors/lesson-editor/lesson-editor.test.tsx`
- `src/domains/app/features/product-form/editors/section-editor/section-editor.component.tsx`
- `src/domains/app/features/product-form/hooks/use-lesson-autosave.hook.ts`
- `src/domains/app/features/product-form/hooks/use-product-loader.hooks.test.tsx`
- `src/domains/app/features/product-form/hooks/use-product-loader.hooks.ts`
- `src/domains/app/features/product-form/hooks/use-section-autosave.hook.ts`
- `src/domains/app/pages/creator-specific/products/product-form/product-form.component.tsx`
- `src/domains/app/pages/creator-specific/products/product-form/product-form.create-flow.test.tsx`
- `src/domains/app/pages/creator-specific/products/product-form/product-form.test.tsx`

## Verification before main integration

- Full suite: 629 tests passed across 99 suites.
- Focused scheduler/workspace tests: 48 passed; real-store/HTTP workspace integration: 18 passed before main integration (21 passed after integration, including three M1+M2 compatibility cases).
- TypeScript passed; ESLint passed with 0 errors and 205 existing warnings.
- Production build (`REACT_APP_USE_MOCKS=false npm run build`) passed with 3 existing webpack size/performance warnings.
- `git diff --check` passed.
- Synthetic browser checks used real ProductForm, Redux, services, nested editors and Tiptap with intercepted HTTP and browser-local fixture persistence. Verified four-type saved workspace entry/reload, Article A → B/reopen/reload, immediate edit → tab flush, rejected Section save blocking Preview, successful retry/return, and stable Membership failure → explicit retry. Preview/list destination chrome was a fixture; this was not a full-App/live-backend E2E run. No hook-order runtime errors were captured.

Suggested commit: `fix: restore saved workspaces and preserve authoring changes`.
Publication is handled separately from the implementation verification; GitHub records the final commit and PR metadata.

## Final verification against merged M1

Finalization uses main `52413ed` and preserves all merged M1 session/authentication behavior.

- `npm test -- --runInBand`: 664 tests passed across 103 suites (previous standalone M2 result: 629 tests / 99 suites).
- Focused combined compatibility run: 29 tests passed across the workspace integration and account-owned Redux lifecycle suites, including 21 workspace integration tests.
- M1's cache-reset fixture now uses the real Membership pending/fulfilled action creators and verifies the new request state exists before logout clears it. No request-ownership guard was weakened.
- `npm run tsc`: passed.
- `npm run lint`: 0 errors, 205 existing warnings.
- `REACT_APP_USE_MOCKS=false npm run build`: passed with 3 existing webpack size/performance warnings.
- Whitespace checks passed.
- Previous synthetic browser evidence is retained with its original scope above; it was not rerun on the integrated main baseline. Live-backend E2E remains pending. Browser termination and forced/history navigation have no asynchronous persistence guarantee.
