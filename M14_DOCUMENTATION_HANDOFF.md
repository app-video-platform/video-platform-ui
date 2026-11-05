# M14 long-content layout handoff

Frontend-only implementation; update Docusaurus separately after review.

- **BUG-066:** Customer detail identity, tabs and panels can shrink; full names and email/definition values wrap, including unbroken strings. No customer records or access data changed.
- **BUG-067:** Sales customer and Product text wraps within shrinkable ledger and card cells, keeping statuses and amounts separate. Order, filter and payment logic is unchanged.
- **BUG-076:** Existing Product picker uses a compact shared checkbox, accessible by its full Product title. Shared CheckboxInput forwards checked and disabled to a focusable native control. Product description supports long unbroken strings. Membership inclusion remains unchanged.
- The existing Contact form also reads the checkbox's boolean checked value, preserving its on/off behavior after the shared control became controlled. This is a compatibility fix; no contact submission or consent enforcement was added.
- **BUG-079:** Shared Uppy Dashboard requests 100% width and is constrained by its parent; Product media grid children can shrink. Thumbnail, Gallery and Promo use the existing uploader and API paths. A responsive picker check does not establish upload persistence.
- **BUG-088:** Shared Product landing hero uses shrinkable grid tracks and allows the full title to wrap, for public, preview and builder consumers. Pricing and owner-profile contracts remain unchanged.

Separately, Explore card actions wrap and mobile inner padding is reduced. At 320px the local synthetic Explore document measured 320px instead of the M13 observation of 366px. Home and About body overflow identified in M13 remain outside this milestone and require M15 investigation.

## Verification and remaining work

Focused tests cover picker keyboard selection and accessible long title, responsive Dashboard width configuration, Product title preservation, and existing Customer, Sales, media and landing behavior. On local synthetic Creator data, Customer detail and populated Sales document widths matched 320, 375, 390, 480, 768, 1280 and 1440px. A Course Media workspace's Thumbnail, Gallery and Promo dashboards fit at all seven widths; the thumbnail measured 309px at 375 and 702px at 768. A Course public hero fit at all seven widths. The local Membership has no eligible picker products.

Long synthetic Customer/Sales identity, long unbroken picker and Download hero fixtures were not available for end-to-end browser measurement. Guest/Admin, other Product types, real upload and deployed/backend behavior also remain unverified. Automated DOM tests and CSS inspection do not establish actual geometry for those scenarios. Verify the five original tickets with the historical synthetic fixtures, keyboard and pointer actions, relevant roles, reload and zoom before claiming complete responsive coverage.

Suggested developer/QA docs: record shrinkable grid/flex tracks, long-text wrapping, full accessible checkbox labels, and container-width uploader sizing. Retain the existing Product, Membership, upload, payment and entitlement boundaries.
