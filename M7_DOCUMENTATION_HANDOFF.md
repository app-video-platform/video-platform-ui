# M7 Course authoring and content integrity handoff

This handoff describes the frontend implementation for synchronizing the
corresponding developer and QA documentation in `video-platform-docs` after
review. No Docusaurus files or Trello cards were changed in this milestone.

## BUG-021 — Article reader content

The Article editor continues to persist serialized Tiptap JSON in
`CourseLesson.content`. The Course Product reader now recognizes supported JSON
documents and converts them to HTML with the installed StarterKit, Link,
TaskList/TaskItem, Image, and Underline extensions. Generated HTML and supported
legacy HTML pass through DOMPurify before the existing reader renders them.
Legacy plain text renders as a React text node. Empty, malformed, and unsupported
JSON is omitted rather than exposed as serialization. Owner, Admin, and
entitlement checks are unchanged; unauthorized readers continue to receive no
private lesson body.

Relevant files: `src/domains/app/pages/product-page/product-page.component.tsx`,
`src/domains/app/pages/product-page/article-content.utils.ts`, and the adjacent
reader tests.

## BUG-019 — Quiz Total points

The editable Auto-Split input is bound to `QuizDraft.totalScore`, accepts positive
whole-number totals, and immediately recalculates each question through the
existing `autoSplitQuizPoints` helper. Integer remainder points are assigned in
question order, so allocations sum to the requested total (for example, 100
points across three questions becomes 34, 33, 33). Manual Split remains
question-owned and derives the total from the question point sum. Existing
passing-score behavior and the Lesson `quiz` serialization field are unchanged;
no Quiz backend model or learner assessment API was added.

Relevant files: `quiz-wizard/quiz-wizard.component.tsx`,
`quiz-wizard/quiz-wizard.component.test.tsx`, and
`src/core/api/services/products/products-api.test.ts` for the existing Lesson
quiz payload boundary.

## BUG-020 — Quiz field associations

Each QuestionCard points and explanation field receives a stable `useId()`-based
name/id. The wizard keys cards by the stable question ID. Existing move and remove
handlers are now available through accessible per-question controls; the
associations remain intact when question cards are added, removed, or reordered.

Relevant files: `quiz-wizard/question-card/question-card.component.tsx`, its
adjacent styles, the Quiz Wizard, and its interaction tests.

## BUG-059 — Section and file-group reorder recovery

Course section and Download file-group order continues to use the existing
section position PATCH API. `CreateProductSections` sends each full reorder
through a serialized operation queue, treats any failed position response as a
failure, shows `Saving`/error feedback, and offers `Retry order save`. A retry
clears the reorder error only after every position PATCH succeeds. Section
detail autosaves omit `position`, preventing their debounce from racing explicit
order writes. Delete continues to flush nested saves and now persists the
remaining positions after a successful deletion.

The API still makes several independent PATCH requests; this frontend change
does not provide an atomic transaction. A partial backend failure may leave a
partially persisted order until the user retries. Do not document transactional
or browser-termination persistence guarantees.

Relevant files: `create-product-sections.component.tsx`,
`section-editor/use-section-autosave.hook.ts`, their tests, and the existing
Product section service.

## Documentation synchronization suggestions

- Course Product page and reader documentation: supported Article content
  formats, safe rendered formatting, legacy HTML compatibility, and the
  unchanged authorization boundary.
- Course authoring/Quiz documentation: Auto-Split remainder policy, Manual Split
  behavior, stable accessible question controls, and the existing nested Lesson
  quiz payload contract.
- Product Builder developer documentation: serialized Course/Download section
  reorder requests, partial failure feedback, and explicit retry behavior.
- QA reports `BUG-021.md`, `BUG-019.md`, `BUG-020.md`, and `BUG-059.md`: append
  implementation and verification evidence after review; keep broader Quiz
  assessment persistence and atomic reorder semantics as separate backend
  investigations.

## Verification record

Final verification passed 781 tests across 119 suites, including the six focused
M7 suites (81 tests). TypeScript passed. ESLint passed with 195 warnings and no
errors. The production build exited successfully in 27.065 seconds; Webpack
reported three existing bundle-size/performance warnings (2.82 MiB main bundle,
793 KiB hero asset). `git diff --check` passed.

Synthetic browser verification confirmed the local frontend compiled and the
application homepage rendered. A direct saved Course route was unavailable in
the separate browser tab, and Article/Quiz/reorder interactions could not be
exercised there because the controlled mock fixture did not expose those records
and the available browser control surface did not provide interaction methods.
Those behaviors are covered by frontend tests, not claimed as browser-verified.
No live backend, deployed Article read, Quiz assessment workflow, or atomic
multi-PATCH reorder is claimed here.
