# M6 upload and file-selection documentation handoff

Use this handoff when updating `video-platform-docs`. The M6 implementation is
frontend-only and changes no backend API contract.

## BUG-042 — Product media MIME

`addImageToProductAPI`, `addProductGalleryImageAPI`, and
`addProductPromoVideoAPI` continue sending the selected raw `File` body. Each
request now declares the file's actual MIME type (`image/png`, `image/jpeg`,
`video/mp4`, or another currently supported type) instead of inheriting Axios's
JSON default. Global JSON request defaults remain unchanged. Existing Product
media validation rejects missing or unsupported MIME types before the API call.

Product presentation-media metadata acceptance is distinct from public storage
delivery. The separate BUG-069 access-denied limitation remains; this fix does not
establish successful CDN/origin visibility.

## BUG-055 — Shared Uppy lifecycle

`src/shared/ui/uppy-file-uploader/uppy-file-uploader.component.tsx` keeps the
current `onFilesChange` callback in a ref and keys initialization on effective
Uppy options, not callback identity or equivalent inline file-type arrays. During
teardown it deactivates and detaches its `file-added` / `file-removed` listeners
before destroying the instance. Cleanup therefore cannot send a false empty
selection to an editor, while intentional user removal still updates selection.

Membership Video and Resource editors retain the selected file summary while
title/description edits, validation correction, and ordinary rerenders update the
parent draft. The shared uploader is also used by Course Video; its selected
filename remains visible. Membership selection stores metadata only. Course Video
continues to save a `pending-video-asset://` reference where applicable. Neither
path establishes durable binary upload, storage, streaming, or playback support;
those capabilities remain backend-pending.

## BUG-043 — Gallery removal and reselection

Gallery uploads reserve a file signature while in flight to prevent duplicate
requests. A rejected upload releases the reservation for retry. Successful
uploads map the signature to the saved Gallery image ID. Only after the matching
delete request succeeds is that signature released, allowing the identical file
to be selected again. Failed deletion keeps the image and its duplicate
protection. The reservation is component-local and does not permanently suppress
files after a component remount.

## BUG-074 — Download upload retries

Download file upload remains the existing presign → storage PUT → confirmation
workflow. A file row appears only after confirmation succeeds. Section Editor
upload errors are keyed by selected file signature: beginning a retry removes
that file's obsolete error, a new failure restores its error, and a successful
completion clears only that file's error. A different upload's failure remains
visible if an older operation completes later. No speculative object cleanup is
performed after failed confirmation; unconfirmed storage bytes may remain under
the existing backend contract.

## Relevant documentation targets

- Developer documentation for shared upload controls and Product media API
  boundaries: document stable Uppy instance ownership, listener teardown, and
  raw-file MIME headers.
- Product-builder documentation for Course and Membership content: clarify that
  file selection and saved metadata do not imply actual binary delivery.
- Download/product authoring documentation: describe the confirmation boundary
  and retryable upload feedback without promising storage cleanup after a failed
  confirmation.
- QA issues `BUG-042.md`, `BUG-055.md`, `BUG-043.md`, and `BUG-074.md`: append the
  implementation and current verification evidence after review/merge. Keep the
  deployed storage-delivery limitation tracked separately under BUG-069.

## Verification and limitations

Focused automated tests pass: 104 tests in eight suites. The full suite passes
756 tests in 116 suites; TypeScript passes; ESLint passes with 203 warnings and
no errors; and `REACT_APP_USE_MOCKS=false npm run build` exits successfully in
26.95 seconds with three bundle-size/performance warnings. `git diff --check`
passes. Synthetic browser verification loaded the local mock app, opened a seeded
Course workspace, and reached its Media screen. The available browser automation
does not expose file-input selection (`setInputFiles`) or page-context `File` /
`DataTransfer` constructors, so real selection and upload interaction were not
verified in-browser. The automated controlled fixtures cover those lifecycles.
No live storage, deployed CDN visibility, Membership/Course binary delivery, or
orphan-object cleanup is claimed from these frontend checks.
