# AGENTS.md

Generated from repository state:

Branch: main
Commit: b9f5510

Last reviewed: 2026-08-07

## Project Shape

This is a React + TypeScript frontend for a creator product platform. The app is organized by domain:

- `src/core`: API clients, DTO/models, Redux store, providers, constants.
- `src/shared`: reusable UI, hooks, utilities, shared system pages.
- `src/domains/app`: authenticated/product app, dashboards, product builder, admin, cart/library/settings.
- `src/domains/auth`: auth routes and pages.
- `src/domains/marketing`: public marketing site.

Use the current code as source of truth. `README.md` still contains starter-era structure notes and should not be treated as authoritative architecture.

## Coding Conventions

- Use TypeScript, React function components, hooks, and existing Redux Toolkit patterns.
- Prefer existing path aliases from `tsconfig.json`: `@core/*`, `@shared/*`, `@domains/*`, `@store/*`, `core/*`, `domains/*`, `shared/*`.
- Keep component folders consistent with current naming: `thing.component.tsx`, `thing.styles.scss`, optional `thing.test.tsx`, and `index.ts` barrel exports.
- Use shared UI from `src/shared/ui` and app components from `src/domains/app/components` before creating new primitives.
- Keep SCSS beside components; global design tokens and base styles live in `src/styles`.
- Add or update tests near the changed component/service/slice when behavior changes.
- Do not casually refactor domain boundaries, route ownership, or product-builder state flow.

## Product Builder Rules

- Supported product types are `COURSE`, `DOWNLOAD`, `CONSULTATION`, and `MEMBERSHIP`.
- Preserve the discriminated product model in `src/core/api/models/product`.
- Preserve the centralized product builder under `src/domains/app/features/product-form` and `ProductForm`; Membership uses this shared builder shell.
- Creation is two-step: create a `DRAFT` product with title/type/owner first, then reveal the full builder.
- `COURSE` and `DOWNLOAD` are section-based. `CONSULTATION` uses consultation-specific details. `MEMBERSHIP` has its own builder path/content tab and must not fall into generic “non-consultation = section-based” logic.
- Keep frontend draft state (`ProductDraft`, blank sections/lessons, local Membership UI state) separate from backend DTOs.
- Do not include sections in product autosave snapshots; sections, lessons, and download files have separate APIs/autosave flows.
- Membership included-product relationships are currently frontend-only. Recurring Membership pricing is currently frontend-only.
- Unsupported Membership fields must not be invented in backend DTOs/API payloads. Do not introduce Membership persistence contracts without confirmed backend support.
- Do not invent product-type-specific backend endpoints when generic `api/products/...` endpoints already exist.

## Validation Commands

- Install: `npm ci` in CI, `npm install` locally if needed.
- Dev server: `npm start`.
- Type check: `npm run tsc`.
- Tests: `npm test` or `npm test -- --runInBand`.
- Lint: `npm run lint`; fix with `npm run lint:fix`.
- Build: `npm run build`.
- Storybook: `npm run storybook`; build with `npm run build-storybook`.

Current checkout verification: `npm run tsc` passes; `npm test -- --runInBand` passes.

## Documentation Rule

After implementing or merging a feature:

- Determine whether the feature changes the product capabilities.
- If yes, recommend Docusaurus updates.
- Determine whether the feature changes architecture or project conventions.
- If yes, recommend updating PROJECT_CONTEXT.md.
- If neither changed, explicitly state that no documentation updates are required.
