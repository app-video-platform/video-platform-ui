# M11 Documentation Handoff — Product & Storefront Reliability

## Implementation by ticket

- **BUG-002:** Product API detail DTOs accept numeric strings. The existing
  Product normalizer converts finite, non-negative decimal numbers/strings to
  numbers and retains `free`; absent, invalid, negative, or precision-losing
  numeric strings remain unset.
  Product summaries use the same normalization. Overview, Product list,
  public/private landing presentation and landing builder therefore use the
  same normalized Product price. Zero remains Free; recurring month/year labels
  retain their cadence. Formatters preserve meaningful fractional digits rather
  than rounding all values to two decimal places. Current frontend
  `ProductCurrency` supports EUR; no additional currency contract was added.
  Historical Order snapshots and checkout amount contracts were not changed.
- **BUG-075:** The shared Storefront public renderer selects saved nonempty
  title/bio before placeholder copy. Whitespace-only values use the empty-field
  behavior. The builder's editable renderers retain ownership of edit controls.
- **BUG-070:** Consultation Overview omits null or undefined buffers using its
  existing empty-row convention, while displaying explicit zero and positive
  minute values.
- **BUG-068:** Storefront Builder applies explicit configured Product IDs first,
  then the backend's newest-created order and signed Java UUID comparison for
  equal timestamps. The shared view model chooses the first eligible published
  Product when a featured ID is absent or ineligible. The derived order is not
  persisted or treated as a change. If any remaining Product lacks valid
  `createdAt`, the builder retains the input order; exact public parity then
  cannot be inferred without complete metadata. Public Storefront reads retain
  the order returned by the backend.
- **BUG-025:** Landing Builder uses the Product owner's public Storefront
  identity and theme for cross-owner views. It requests private Creator
  Storefront configuration only for the signed-in Creator owner. If the public
  owner profile is unavailable, the Admin's identity and theme are not
  substituted. Product landing configuration remains Product-scoped.

## Boundaries and documentation updates

- Product API normalization is in
  `src/core/api/services/products/utils/product-normalizers.util.ts`; Product
  DTO response types are in `src/core/api/models/product/products.types.ts`.
  Price rendering remains in the existing Product list and landing-page
  utilities. Storefront ordering/profile presentation remains in the existing
  shared Storefront utilities and component.
- Public owner identity comes only from the existing
  `GET api/storefronts/:creatorId` read model. No private Creator profile or
  configuration permission was broadened. Existing session boundaries and
  Product detail request ownership remain in use.
- Suggested Docusaurus/QA updates: document consistent saved Product prices,
  public profile fallbacks, optional Consultation buffer presentation, derived
  Storefront ordering and featured fallback, and Admin cross-owner preview
  behavior. Preserve Membership publishing, upload, and entitlement limits.
- Verify the deployed Product summary's creation timestamps and public
  Storefront comparator after deployment. Missing creation metadata prevents a
  guaranteed builder/public default-order match. Live backend and deployed
  four-role checks have not been performed in this work.

## Verification

- Focused tests: 48 passed across five suites, covering price normalization,
  Product Overview buffers, public Storefront copy, order/featured fallback,
  and owner vs Admin landing previews for four Product types.
- Full suite: 913 tests across 129 suites passed. TypeScript passed; ESLint
  passed with 185 warnings; `git diff --check` passed. Production build with
  `REACT_APP_USE_MOCKS=false` succeeded with three existing webpack
  asset/entrypoint size warnings.
- Local synthetic browser: public Storefront title and biography persisted
  after reload; the same paid Course displayed its price in Overview, public
  Product, private preview and owner Landing Builder. Local fixtures did not
  supply the requested string-priced Download, null buffers, empty-config
  ordering, or foreign Admin owner; those cases were exercised in automated
  tests, not claimed as browser coverage. No deployed Product or account was
  modified.
