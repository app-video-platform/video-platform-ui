# M15 marketing interaction handoff

Frontend-only changes; update the Docusaurus site separately after review.

- **BUG-028:** LegacyExpansionPanel measures its inner content in a layout effect and observes size changes, including initially expanded panels. It preserves unique header/region IDs, animation and the Course reader consumer.
- **BUG-034:** M14 already corrected shared native checkbox semantics and Contact's boolean state. M15 adds keyboard and visible-state regression coverage; no submission or consent enforcement was added.
- **BUG-061:** Contact provides the `faq` fragment target and scrolls to it on fragment navigation, with a navigation offset. The footer's existing link remains unchanged.
- **BUG-046:** Product, Feature and CTA reveal targets remain in keyboard order. Entering a section by focus completes its existing GSAP reveal so the focused control is visible. Reduced-motion users retain the existing no-animation path.
- **BUG-047:** GSAP clears transient inline opacity/visibility after Product, Feature and Trust reveal completion; CSS controls the active/dimmed state. Focus and mouse exit clear Product/Feature emphasis. ScrollTrigger and GSAP context cleanup remain in place.

## Evidence and limitations

In the local synthetic Creator browser, direct `/contact#faq` positioned the FAQ heading inside the viewport and the default-open answer measured 50px on first load. Keyboard Tab from the hero reached Create a Course, and Tab from the last Product control reached Private Storefronts. After reveal, Product and Feature siblings measured opacity 0.38 and the active item 1. Trust hover, complete fresh Guest traversal, reduced-motion runtime behavior, and manual screen-reader testing remain unverified. Automated tests cover initial/dynamic expansion, unique panel relationships, Contact fragment targeting, and checkbox keyboard/state behavior.

At 320/375px, Home initially measured 1062px and About 762px. The Product cards now stack on narrow screens and About's Different section uses a single column; Home's fixed text/feature widths were also constrained. Local measurements after these changes still showed Home 485px at both 320 and 375; About measured 464px at 320 and 472px at 375, with 874px at 768. Headers fit; further section-level responsive work remains necessary. These observations are not whole-site conformance claims.

Suggested QA/docs updates: describe shared expansion height observation, Contact fragment and checkbox behavior, animation reveal ownership and focus coordination, and reduced-motion checks. Verify Trust hover, full keyboard order and the remaining Home/About content overflow across roles, zoom and browsers. No backend delivery, consent enforcement or live deployment parity is implied.
