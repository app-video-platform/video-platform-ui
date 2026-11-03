# M4 authentication UI documentation handoff

Update the authentication and onboarding documentation to reflect the frontend behavior after M4:

- Signup performs a credentialed CSRF bootstrap at `GET /api/auth/csrf`, requires a non-empty returned token, then submits the existing registration payload with credentials and `X-XSRF-TOKEN`. Bootstrap/registration failures remain on the form with retryable feedback; successful registration continues to `/auth/email-sent`.
- Email verification reports success only after the verification thunk fulfills. Missing, invalid/already-used, expired, and service-failure outcomes remain distinct from success. No resend endpoint or resend workflow was added.
- Password guidance remains visible while the form is focused or submitted so it does not move the Sign in action. Shared password visibility buttons expose Show/Hide accessible names and pressed state. Sign-in errors are associated with their controls.
- Signup, sign-in, password recovery, email-sent, and verification cards reflow for narrow screens; verification guidance uses readable foreground colors on white cards.

The backend handoff describes the CSRF route and cookie behavior, but this frontend change does not prove that route is deployed in every environment. Document the route as the required integration contract and retain deployment-specific cookie/CORS verification as pending. No live registration, mailbox delivery, or deployed CSRF interoperability was performed. The existing forgot/reset and resend-verification limitations remain; this milestone does not add those backend capabilities.
