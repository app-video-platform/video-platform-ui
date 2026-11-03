# M5 collection recovery and purchased access handoff

Please update the separate authentication, shopping, and Library documentation to
reflect the verified M5 frontend behavior:

- Cart and Wishlist hydrate only valid Product summaries, deduplicate by Product ID,
  and recover from malformed JSON, wrong collection shapes, invalid entries, or
  unavailable browser storage. Cart totals are recomputed from accepted item prices;
  the current Cart stores one entry per Product and has no quantity field.
- Cart and Wishlist remain browser-local preferences across M1 session boundaries.
  Their contents do not represent purchases, entitlements, or access.
- Wishlist dropdown `Add to cart` shares the existing move behavior: it adds once to
  Cart, removes the Wishlist entry, and opens Cart. If the Product is already in
  Cart, it does not duplicate it and removes the Wishlist entry.
- The same entitlement-backed Library routes are available to User, Creator, and
  Admin roles. Successful free enrollment and confirmed paid checkout can therefore
  open the shared Library for Creators as well. The Library reads
  `GET /api/entitlements/me`; Product/file endpoints remain responsible for
  server-side entitlement enforcement.
- Library `aria-selected`, keyboard roving focus, and displayed content follow the
  active child URL, including browser history navigation.

No backend or Docusaurus changes were made. Preserve the existing backend authority
for purchase records, free enrollments, entitlements, Product access, and file access.
Do not document route access as proof of entitlement. No real purchase or payment was
performed; any browser checks use synthetic/local data and existing mocked commerce
contracts only.
