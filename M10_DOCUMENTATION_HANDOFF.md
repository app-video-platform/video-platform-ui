# M10 Documentation Handoff — Discovery & Search Reliability

## Frontend implementation

### BUG-004 — Creator storefront navigation

- Explore Creator links now use `appRoutes.store(creatorId)`, which builds the
  canonical public route `/app/store/:creatorId`.
- Product search cards expose the same Storefront link when `createdById` is
  available. When identity is unavailable, Explore renders the Creator label
  without a broken link and search cards omit the link.
- The Storefront route remains outside the authenticated route wrapper. Router
  tests cover Guest, User, Creator, and Admin viewers. Native links preserve
  normal browser behavior, including opening in a new tab.

### BUG-014 — Search URL state

- `/app/explore/search` reads `term` and the zero-based `page` directly from
  `useSearchParams`; there is no independent page state that can drift from the
  URL.
- New searches write the submitted term and omit `page`, selecting API page 0.
  Pagination changes are history entries. Back/Forward rehydrates the heading,
  active page, and results from the restored URL. SmartSearch mirrors the active
  committed term when the search route changes.
- Missing page means zero. Negative, nonnumeric, unsafe-integer, and
  noncanonical page values normalize to page zero with `replace`, preserving a
  historical entry rather than adding a second one. Display labels start at
  `Page 1`. An empty out-of-range page includes an explicit return-to-first-page
  action.
- Search requests use React Query keys containing term, page, and fixed page
  size. Old term/page responses remain isolated to their own keys.

### BUG-091 — Autocomplete freshness

- SmartSearch hides suggestions while their debounced query differs from the
  current trimmed input and clears the highlighted index immediately on input
  change.
- No suggestion is active by default. Arrow keys intentionally select a current
  suggestion; Enter uses it only when that current suggestion is highlighted.
  Otherwise Enter submits the current raw input. Escape closes the list and
  clears selection; clearing the input cancels debounce and closes it.
- The input exposes combobox/listbox relationships and an active-descendant
  only for a selected current option. Query-keyed autocomplete results prevent
  late responses for a previous term from replacing current options.

### BUG-013 — Pagination metadata boundary

- The frontend corrects page numbering, URL synchronization, invalid-page
  feedback, and stale-query/page results. It continues to use the API's
  `last`/`totalPages` metadata to decide whether Next is available and does not
  derive totals from row count or infer another page from a full page.
- `SearchResponse` exposes `content`, `number`, `totalPages`, `totalElements`,
  `last`, `first`, and `pageable`. No independent reliable continuation token
  or result-count source is exposed by the current frontend API contract.
- The contradiction in the provided QA remains a backend dependency and BUG-013
  must remain open. The frontend cannot promise access to later rows while page
  zero reports `last=true` and one total page.

## Backend follow-up — keep BUG-013 open

**Affected contracts:** public search `GET /api/products/search?term=&page=0&size=20`
and owner-scoped search `GET /api/products/search/{userId}/products?term=&page=0&size=5`
as represented by the controller route and the isolated QA matrix.

**Recorded reproduction:** the deployed public API returned 20 rows for page 0
with `totalElements=20`, `totalPages=1`, `last=true`; page 1 returned 20
different Product IDs with `totalElements=40`, `totalPages=2`, `last=true`.
The isolated owner-search matrix reproduced the same shape for size 5: page 0
reported 5 elements/1 page/last true, page 1 reported 10 elements/2 pages/last
true, and page 2 returned the remaining 2 of 12. The QA report records 24
role/owner/sort combinations reproducing the owner-search inconsistency.

**Expected contract:** for one stable query and sort, every page should report
the same complete `totalElements` and `totalPages`; `last` should be true only
for the actual final page. If totals cannot be supplied reliably, expose a
documented continuation signal (for example, a correct `hasNext`) and keep it
consistent across pages.

**Why frontend inference is unsafe:** the client cannot distinguish a truly
final full page from a page whose total metadata is undercounted. Counting rows
or assuming a full page implies another page invents semantics, and automatic
fetching could be unbounded. The UI therefore honors the declared server
contract and does not claim that the later page is reachable from Next.

**Backend verification requested:** use isolated fixtures that span at least
three pages; compare the same query, size, owner scope, and sort at pages 0, 1,
and the final page; assert stable totals and correct `last`; cover empty, exact
full-final, and partial-final pages; repeat the owner-scoped case without
cross-owner leakage. Then rerun the public deployed four-role check. QA sources:
`video-platform-docs/qa/runs/2026-09-30-01/issues/BUG-013.md`, including the
4 October isolated owner-search extension and 23 October deployed matrix.

## Validation and documentation sync

- Focused component/router tests cover canonical links, role access, deep-link
  pages, new-search reset, history traversal, malformed page values, empty and
  out-of-range pages, current-query selection, stale async results, and
  combobox state. Full result: 127 suites and 874 tests passed.
- `npm run tsc` passed.
- `npm run lint` passed with 185 warnings and no errors. The warning in the
  touched Explore page is its pre-existing `console.error`; no new lint errors
  were introduced.
- `REACT_APP_USE_MOCKS=false npm run build` exited successfully. Webpack emitted
  its existing three performance/asset-size warnings for the bundle and hero
  image.
- `git diff --check` passed.
- Local browser verification used the ignored synthetic mocks. Guest Explore
  Creator navigation opened the public Storefront and survived reload; a new
  search from `page=2` opened page 0; browser Back/Forward restored the active
  term, heading and page; immediate Enter after replacing an autocomplete query
  submitted the new query. The current local mock returns a default Storefront
  for unknown creator IDs, so invalid-ID browser behavior is not claimed from
  that runtime; the existing API-mocked Storefront test verifies the controlled
  unavailable state.
- No live-backend request was made. In particular, BUG-013 later-page
  reachability remains blocked on reliable server pagination metadata.
- Suggested Docusaurus updates: Explore navigation/access, Storefront route,
  URL query/page conventions, keyboard autocomplete behavior, pagination labels,
  and an explicit note that reliable later-page navigation depends on the
  backend pagination contract. Do not document BUG-013 as fixed.
- `PROJECT_CONTEXT.md` was updated because M10 establishes durable URL-state,
  query-freshness, route-builder, and pagination-contract conventions.
