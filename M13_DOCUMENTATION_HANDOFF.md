# M13 responsive navigation and Settings handoff

Frontend-only changes; update Docusaurus separately after review.

- **BUG-010 / BUG-087:** Marketing navigation retains its links and role-dependent actions in one compact non-modal menu at widths up to 900px. The brand remains visible. Menu exposes expanded state, closes on route changes and Escape, and returns focus to its trigger. Account dropdown content flows within the compact menu. Guest actions are withheld while authentication is resolving or unavailable.
- **BUG-012:** Marketplace keeps the existing SmartSearch visible on a second row at widths up to 1000px, with Explore, available collections, notifications, account or guest actions in a compact menu. The search form can shrink inside its container; Explore no longer overlaps its pointer target. Library uses its absolute route. Existing search and session contracts are unchanged.
- **BUG-065:** Settings tabs remain in a contained horizontal scroll region; sections stack on narrow screens, and profile actions, social inputs and calendar controls can shrink or wrap. M9 persistence and M12 native disabled states are unchanged.

## Browser evidence and limits

Local synthetic Creator fixtures were used. At 320, 375, 390, 480, 768, 1280 and 1440px the marketplace header and search fit the viewport; the loaded Creator Profile Settings page, action row and social rows also fit. At 1440px the center hit test and pointer click resolve to Explore. On all eight marketing routes at 320px the shared header ends at 320px and offers the menu. Home and About still have independent body widths of 1062px and 762px respectively at 320px. The local Explore page has a separate product-card action extending to 366px at 320px; at 375px and above its measured document fits. These are page-body findings, not header measurements, and remain for their own scope.

The browser matrix did not cover Guest, User or Admin variants, all Product families, 200% zoom, complete keyboard traversal, or live backend data. The menu and guest/User role branches have component coverage, and search behavior has existing tests. No profile, collection, account or Product mutations were performed. No backend change or dependency was identified.

Suggested documentation updates: describe the two existing header families, compact menu behavior and keyboard dismissal, always-available marketplace search, responsive Settings tab strip and stacked sections. Extend responsive QA across roles, direct reload/history, Product/Storefront routes, keyboard/touch and zoom. Track Home/About and long Product content independently in later page-layout work; do not describe this milestone as eliminating all page overflow.
