# M3 onboarding documentation handoff

Frontend implementation reference for the Docusaurus update. Documentation should describe the behavior below and keep server-side persistence claims scoped to the existing API contract.

- The canonical onboarding entry is `/onboarding`, protected by the existing authenticated-role guard. The app-prefixed `/app/onboarding` entry remains available. Incomplete profiles see the Welcome → Basic Profile → About You → Additional information → summary flow; completed profiles retain the current redirect/reset screen.
- Each profile step waits for the existing `api/user/userInfo` update to succeed before moving forward. A failed update keeps the current step and entered values, shows a retry action, and prevents duplicate submissions while pending. M1 keeps the authorized wizard mounted during ordinary profile mutation loading and clears it at account/session boundaries.
- Validated controls use shared accessible labels and associated error text. Invalid controls expose `aria-invalid` and `aria-describedby`; correction clears the field's validation state through the existing React Hook Form flow.
- Social-link edits compare against the current edited link, so users can restore an original value or restore a cleared link. Existing single-entry-per-platform behavior remains.
- Location results use the existing OpenStreetMap/Nominatim lookup. Invalid coordinates, non-success responses, network errors, and incomplete address data do not update the profile form; recoverable lookup failures show feedback and a retry control. A previously accepted location remains available if a later lookup fails.

Automated frontend tests use synthetic profile data and controlled responses. No live-backend onboarding save, deployed Nominatim availability, or real account change was performed. The current `UpdateUserRequest` includes city and country but not latitude/longitude, so documentation must not claim that this flow persists coordinates. No backend-pending capability is enabled by this milestone.
