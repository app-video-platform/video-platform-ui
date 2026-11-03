# M8 Request freshness and async feedback handoff

Implemented on `codex/m8-request-freshness-async-feedback`, based on merged M7
`main` commit `796ceff9667897ac644a3e695e0320037d603b92`.

The sibling docs repository was used only to read the five QA reports. Its
existing M7 edits were preserved. Trello cards and comments were read; all five
cards were in Backlog with no comments at inspection. No backend, Docusaurus,
Trello, ignored mock, package, or API-contract changes were made. Nothing was
committed, pushed, or submitted as a PR. M9 was not started.

## Changes by ticket

| Ticket | Result | Main implementation |
| --- | --- | --- |
| BUG-039 | Late Product detail success/error cannot replace the active Overview or end its loading state. | Product slice, detail selectors, Overview route guard and cleanup. Other Product read consumers use the new detail status. |
| BUG-071 | Customer pending clears the previous profile; rendered identity must match the route. Late completions cannot replace current data/status. | Customers slice/thunk and CustomerDetail route guard/cleanup. |
| BUG-072 | The selected Order drawer stays open while loading or showing a current failure. Late responses cannot replace it or reopen a closed drawer. | Sales detail ownership, URL-driven SalesPage drawer, loading/error/Retry presentation. |
| BUG-054 | Admin Audit and Products each own their latest query, results, loading, and error independently. | Admin slice and both pages; complete-query presentation guard, filter/page behavior, Retry/empty states, current-query refresh after deletion. |
| BUG-053 | Customer errors accurately distinguish HTTP 404 from other failures without exposing backend details. | Customer thunk retains HTTP status; CustomerDetail renders safe messages and Retry. |

## Request and presentation conventions

- Reuse `createAsyncThunk` request IDs. Detail pending records the requested
  entity ID, clears old data/error, and starts its own loading state. Fulfillment
  and rejection must match both the active request ID and target ID. Request ID
  comparison protects repeated requests for the same entity and A → B → A.
- Admin Product and Audit pending record their own request IDs and complete
  query keys using `JSON.stringify(action.meta.arg ?? {})`. Their pages build
  the same ordered query shape from current inputs. The guard hides obsolete
  rows/errors immediately, including before the request effect runs.
- A stale action performs no writes, including loading/error changes. A current
  failure settles its channel and permits Retry. A current successful empty
  Admin response shows `No results found.`
- Completing a request clears its active request ID. Detail target/query keys
  remain available to associate the settled status with the current selection.
  `clearCurrentProduct`, `clearCurrentCustomer`, and `clearCurrentOrder`
  invalidate ownership as well as clearing data/status.
- Product detail status is independent of Product list/mutation status.
  Customer and Sales retain their existing list/detail separation. Admin
  Products and Audit have independent status even when Users/role operations
  settle. The preexisting generic Admin status is retained for other consumers.
- Navigation does not require cancellation to be correct. No new request
  cancellation API or generic request-management abstraction was introduced.
  Existing M1 session-generation tagging, Axios session cancellation, root
  private-state reset, and stale-action middleware remain in force.

## View behavior and contracts

### Product

Overview checks the requested Product ID and loaded Product ID against the
route, shows its labeled loading skeleton while the active read is pending,
and keeps the existing failure/not-found/retry presentation. Detail clear runs
on Overview selection change/unmount. Public Product, private Preview, landing
page builder, and workspace initial loading use the detail status selectors;
existing authoring mutation/autosave feedback remains separate.

The `getProductById` service, response normalization, permissions, and API
endpoints are unchanged. Freshness does not authorize a Product read or replace
the existing ownership/published/access checks.

### Customer

The old profile is removed on pending and guarded by route identity before
rendering. Tabs reset to Overview on a new selection. Direct detail routes
fetch normally. The thunk preserves HTTP status while storing only a safe
generic error message.

| Result | Visible feedback |
| --- | --- |
| Loading | `Loading customer` |
| HTTP 200 | Selected Customer profile |
| HTTP 404 | `Customer not found` and `This customer is not available.` |
| Network, server, or unexpected error | `Customer details could not be loaded` and `Please try again.` |

Both failure presentations offer Retry. Neither reveals whether a 404 means a
nonexistent or nonowned Customer. Raw API messages and internal identifiers are
not displayed. Customer list placeholder copy was outside this detail fix.

### Sales

The `order` URL parameter remains the selection authority. The drawer opens for
that selection even before data arrives, shows `Loading order…`, and keeps
current failures in the drawer with a safe error and Retry. Loaded details must
match the selected ID. Closing removes the query parameter and clears pending
ownership; reopening issues a new request, including for the same Order ID.
Order APIs, summary/list channels, payment information, and authorization are
unchanged.

### Admin

Audit queries include Action, Target type, Target ID, page, and size. Product
queries include search, owner ID, type, status, page, and size. Each query update
owns a fresh request; filters reset page to zero and paging is disabled during
pending/mismatched queries. Query serialization and input case are preserved;
the backend still determines matching semantics. Product deletion refresh uses
the query current when deletion finishes. Admin routes/permissions and API
contracts are unchanged.

## Files changed

Paths below are relative to `video-platform-ui`.

- Store implementation: `src/core/store/product-store/product.slice.ts`,
  `product-store/product.selectors.ts`, `customers-store/customers.slice.ts`,
  `sales-store/sales.slice.ts`, and `admin-store/admin.slice.ts`.
- Store tests: `src/core/store/request-freshness.test.ts`,
  `session.middleware.test.ts`, and `admin-store/admin-slice.test.ts`.
- Admin pages: `src/domains/app/pages/admin-page/admin-audit-page.component.tsx`
  and `admin-products-page.component.tsx`.
- Customer page/test: `src/domains/app/pages/creator-specific/customers/`
  `customer-detail.component.tsx` and `customers.component.test.tsx`.
- Sales page/test: `src/domains/app/pages/creator-specific/sales-page/`
  `sales-page.component.tsx` and `sales-page.component.test.tsx`.
- Product detail consumers under
  `src/domains/app/pages/creator-specific/products/`: `product-overview/`,
  `product-form/`, `product-preview/`, and `product-landing-page-builder/`
  component files; also `src/domains/app/pages/product-page/product-page.component.tsx`.
- New component coverage: `src/domains/app/pages/request-freshness.integration.test.tsx`.
- Durable conventions: `PROJECT_CONTEXT.md`; this handoff is the only other
  documentation artifact added in the UI repository.

## Verification

Controlled tests use deferred Axios Mock Adapter responses with the actual
thunks, services, root reducer, and M1 middleware. They explicitly resolve B
before A, finish A while B is pending, reject stale A after B, preserve B's
failure against A's success, retry, interleave A → B → A, and distinguish
duplicate same-ID reads across all five channels. Detail clear/close and account
transitions invalidate pending reads. Independent Admin and Product list/detail
status channels are also asserted.

Rendered integration coverage exercises Product stale success/rejection and
loading, Customer identity/loading and safe 404/503/network retry, Sales drawer
selection/close/error/retry, and Admin stale defaults, combined filters,
mixed-case serialization, paging, errors, retry, and empty results. Existing
session and Admin fixtures now seed owned reads through proper pending/fulfilled
actions; Sales tests wait for loaded detail rather than merely the newly visible
loading drawer.

- Focused post-review request-freshness, component, and reducer run: **58 tests
  passed in 3 suites**. A broader pre-review focused run passed 93 tests in 8
  suites.
  The two new M8 suites account for **54 tests**.
- Full `npm test -- --runInBand`: **836 tests passed in 121 suites**.
- `npm run tsc`: passed.
- `npm run lint`: passed, **0 errors / 195 existing warnings**.
- `REACT_APP_USE_MOCKS=false npm run build`: passed in **30.173 seconds**,
  with three existing Webpack bundle-size/performance warnings (2.82 MiB main
  bundle and 793 KiB hero asset).
- `git diff --check`: passed.

### Browser checks

Used the in-app browser against `http://localhost:8087` with the existing
strict, ignored local mocks enabled; no production API or business data was
mutated. Verified:

- Published Course Overview loads its correct identity and content outline.
- Maya Johnson → customer list → Mira Patel displays the correct profile and
  matching route.
- Sales Order `ORD-2026-00124` opens with its server-shaped detail, closes and
  removes the query, and `ORD-2026-90001` subsequently opens correctly.
- Reloading the selected Order URL restores its drawer and matching detail.
- A synthetic unknown Customer URL displays the new 404 message and Retry,
  without the API-not-connected placeholder.

The local browser identity was Creator. Admin filtering, forced 503/network
responses, and controlled response ordering were verified in automated tests,
not claimed as browser/deployed E2E coverage. Production ownership, real network
timing, and deployed backend behavior still require the corresponding QA rerun.
No backend implementation dependency was introduced.

## Suggested documentation and QA synchronization

- Developer state/data-flow documentation: request ownership, detail/list status
  separation, independent Admin channels, query identity, and interaction with
  M1 session invalidation.
- Product Overview and Customer documentation: route-safe loading and current
  failure/retry behavior; replace inaccurate Customer detail integration copy.
- Sales documentation: URL-selected loading/error drawer and close semantics.
- Admin documentation: query freshness, filter/page reset, empty/error states,
  preserved case/serialization, and current-query refresh after deletion.
- Append implementation evidence to BUG-039, BUG-071, BUG-072, BUG-054, and
  BUG-053 reports after review. Keep frontend automated/local-browser evidence
  separate from deployed E2E verification; update aggregate QA progress only
  under the docs workflow's normal evidence rules.

No Docusaurus or QA report files were edited during M8.

## Suggested Git metadata

- Branch: `codex/m8-request-freshness-async-feedback`
- Commit: `fix: prevent stale responses across product and admin views`
- PR title: **Prevent stale responses in Product, Customer, Sales, and Admin views**

Suggested PR body:

> Rapid navigation and filter changes could let an older response replace the
> current Product, Customer, Order, or Admin results. Track the latest RTK
> request per detail/query channel, guard presentation by the current selection,
> and preserve current loading/error state against stale completions. Keep Sales
> drawers open through current failures and provide accurate, private Customer
> 404/server feedback with retry.
>
> Validation: 835 tests across 121 suites; TypeScript, ESLint, production build,
> and whitespace checks; local fixture browser checks for Product, Customer,
> and Sales. See M8_DOCUMENTATION_HANDOFF.md for coverage and deployed E2E limits.
