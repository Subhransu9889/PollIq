# Production readiness

This pass improves the landing page, authentication UI, builder save/publish flow, and response integrity. It does not certify a deployed production system.

## Implemented

- Responsive landing page with an interactive, explicitly local demo, theme switching, mobile navigation, native FAQ disclosures, keyboard focus, and reduced-motion support.
- Authentication forms with native validation, password visibility labels, handled mutation failures, and no inactive social-login controls or invented security claims.
- Stable question IDs on edits; transactional form and response writes; rejection of removing or changing the type of questions with saved answers; atomic response counts.
- Server-side validation of answer ownership, duplicate answers, required consent, selections, numeric ranges, email, dates, URL fields, and conditional visibility.
- Save before publish, truthful save failure state, working recent-form navigation, per-account draft storage, and visible query errors.

## Signed-in workspace

- Compact responsive navigation, real overview counts, searchable/filterable/sortable forms, and grid/list layouts.
- Working sign-out with cookie clearing and account cache cleanup; network failures stay recoverable rather than redirecting to login. The web app imports its own tRPC runtime client so errors keep their authentication status across React Query.
- Unsaved-edit protection, pending states, validation before save, protected answered questions, and interactive question previews.
- Form selection and refresh for responses/analytics; searchable responses and CSV export with spreadsheet-formula neutralization.
- Empty analytics report zero; saved themes resolve by exact identity before fuzzy matching, and preview fonts use locally available fonts.

## Verification

- Web production build and API build.
- Web, services, and API TypeScript checks.
- Four response-validation regression groups in `packages/services/form/tests/validation.test.ts`.
- Chrome checks at 1440, 768, 390, and 320 pixels: demo completion/reset, theme switching, navigation, FAQ interaction, horizontal overflow, auth validation, and password visibility. No browser runtime errors detected.

- Signed-in Chrome tests with controlled API fixtures: 1440/1024/768/390/320px overview and builder; narrow-screen templates, themes, responses, analytics; search/filter/list; discard protection; failed/successful saves; create/publish; response selection/search; CSV download; sign-out; empty workspaces; API retry; expired-session redirects. No live database was changed by these tests.
- Three CSV regression tests in `apps/web/lib/tests/response-export.test.ts` cover escaping, Unicode, empty data, and formula neutralization.

## Release work still required

- Run signup → login → create → publish → submit → edit → inspect/export responses against an isolated staging database, including rollback and concurrent submissions. No live database writes were used for verification in this pass.
- Replace the existing HMAC password storage with a dedicated password KDF and a migration path; add authentication throttling and token expiration. The existing user-service edits were preserved.
- Verify HTTPS, cookie/CORS behavior for the actual frontend/API domains, database backups, monitoring, and abuse controls.
- OAuth, password reset, billing, and workspace settings are not implemented; inactive entry points were removed from the main flows. Invented activity and template metrics were removed from the workspace.
- No deployment or database migration was performed.
