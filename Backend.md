# KodarCrystal backend setup and integration

This is the implementation plan for the backend. The application currently runs as a frontend demo: accounts, OAuth, email delivery, AI generation, payments, exports, deployment, and MCP tools are simulated. Local projects are saved in this browser; their links do not grant access from another device. No backend server, database, or provider account has been created by this frontend update.

## What is already prepared

- `src/lib/backend/config.ts`: validates the public API base URL.
- `src/lib/backend/client.ts`: JSON requests, cookie credentials, CSRF header support, idempotency keys, cancellation, a 30-second timeout, and structured errors.
- `src/lib/backend/contracts.ts`: Zod response schemas and TypeScript types for users, sessions, projects, builds, usage, and health.
- `src/lib/backend/services.ts`: service functions for health, authentication, projects, builds, and usage. These are integration foundations; the current UI does not call them automatically.
- `src/components/BackendQueryProvider.tsx`: TanStack Query cache available throughout the app, with no automatic mutation retries.
- `.env.example`: public frontend configuration and optional local API proxy configuration.

Setting an API URL alone does **not** replace mock authentication or enable real generation. Implement the server below, then migrate each screen explicitly. Keep Workspace and Community in their lazy-loaded non-route modules, MCP behind its shared lazy wrapper, and theme state in the root ThemeProvider.

## Recommended architecture

Use one small API service and one background worker, backed by managed infrastructure:

| Responsibility | Recommended choice | Why it is needed |
| --- | --- | --- |
| HTTP API | Node.js 22.12+ with Fastify and TypeScript | Authorization, validation, provider calls, billing, and orchestration |
| Identity | Supabase Auth | Password login, verification, recovery, Google/GitHub OAuth; Apple is optional |
| Database | Supabase Postgres | Users, workspace membership, projects, versions, builds, usage, and billing |
| Object storage | Supabase Storage or Cloudflare R2 | Avatars, generated files, version archives, exports, and attachments |
| Background jobs | Redis and BullMQ | Generation, build verification, export, deployment, retries, and cancellation |
| AI provider | Anthropic for the existing Claude-oriented roadmap, or another chosen provider | Planning and code generation from prompts |
| Generated-code runner | A managed sandbox service or isolated disposable containers | Untrusted generated code must build outside the API process |
| Payments | Paystack for NGN subscriptions; Flutterwave can be added later | Checkout, subscription lifecycle, webhook confirmation, and receipts |
| Email | Resend SMTP configured in Supabase, or another transactional SMTP provider | Verified email delivery, password recovery, invites, and billing notifications |
| Deployment | Vercel/Netlify APIs, added after generation works | Publish generated projects using user-authorized credentials |
| Observability | Structured logs, Sentry or equivalent, uptime checks | Detect failed jobs, frontend/API errors, payment failures, and quota issues |

The frontend framework is TanStack Start with server rendering, not a static Vite-only app. Its production output defaults to Nitro's Node server: build with `corepack pnpm build` and run with `corepack pnpm start`. Set `NITRO_PRESET=vercel` or another supported preset for the deployment host. The API and worker can run on Render, Railway, Fly.io, or containers. A worker that executes builds needs a runtime suitable for its sandbox; it should not run long jobs inside a short-lived serverless HTTP request.

Prefer a same-origin API: the browser calls `/api/v1`, and the frontend host/reverse proxy forwards those paths to the API. On Vercel, configure an API rewrite **before** any frontend fallback. For a different API origin, configure exact-origin CORS and cookie behavior as described below.

## Accounts and infrastructure to create

1. Create separate development/staging and production Supabase projects. Choose a region near the expected users and API host. Enable backups and verify a restore before launch.
2. Enable email/password identity and configure signup verification. Register the approved frontend URL, OAuth callback URLs, and recovery redirect URL in Supabase.
3. Register Google and GitHub OAuth applications with exact callbacks. Set up Apple developer credentials only if Apple sign-in will ship. Remove or disable any provider that is not configured.
4. Verify a sending domain with your email provider; configure SPF, DKIM, and DMARC. Configure custom SMTP in Supabase. The default development mail service is not a production delivery plan.
5. Create private storage buckets: `avatars`, `attachments`, `project-artifacts`, `project-versions`, and `exports`. Set limits, lifecycle rules, and upload MIME allowlists. Expose public community thumbnails through a separate reviewed bucket or controlled endpoint.
6. Provision Redis with persistence and access restricted to API/worker hosts. Configure job retention, exponential backoff, dead-letter handling, and maximum concurrency.
7. Create the model-provider account, API credential, spending limit, and model configuration. Confirm actual model availability and pricing before choosing a model ID.
8. Set up the sandbox provider, or provision isolated containers with CPU, memory, disk, network, and execution limits. Reserve a separate preview domain that never receives app session cookies.
9. Create Paystack test credentials, test subscription plans, and the webhook endpoint. Complete business onboarding before switching to live credentials. Decide the actual NGN prices and entitlements; the shared current UI prices are USD demo values, not live NGN checkout amounts.
10. Register deployment OAuth applications only when deployment is ready. Register each MCP provider separately; a simulated “connected” badge is not an authorization grant.
11. Configure a secrets manager, TLS/DNS, monitoring, database migrations, staging CI, production backups, and access for maintainers.

Budget for database/storage, Redis, API/worker hosting, model tokens, sandbox execution, email, bandwidth, payment fees, and monitoring. Set a cap on generation and sandbox spending before opening public signup.

## Backend project and commands

Create an independent backend package inside this directory, or place it in a separate repository. The following commands are for creating that package; it is not already present:

```powershell
New-Item -ItemType Directory -Path backend
Set-Location backend
corepack pnpm init
corepack pnpm add fastify @fastify/cors @fastify/cookie @fastify/helmet @fastify/rate-limit @supabase/supabase-js bullmq ioredis zod dotenv
corepack pnpm add -D typescript tsx @types/node
```

Add your chosen model SDK, sandbox SDK, and observability SDK after choosing the providers. Paystack can be called through server-side HTTPS without putting a payment secret in the browser.

Use this package layout:

```text
backend/
  package.json
  tsconfig.json
  .env.example
  src/
    server.ts                 HTTP entry point and health endpoints
    config.ts                 validate environment on startup
    plugins/                  cookies, sessions, CORS, CSRF, rate limits
    routes/                   auth, workspaces, projects, builds, billing
    services/                 identity, credits, storage, models, payments
    workers/                  generation, export, deployment
    schemas/                  request/response validation
    db/migrations/            versioned SQL
    jobs.ts                   worker entry point
  tests/                      authorization, jobs, webhook and API tests
```

Recommended scripts are `dev: tsx watch src/server.ts`, `worker:dev: tsx watch src/jobs.ts`, `build: tsc`, `start: node dist/server.js`, and `worker: node dist/jobs.js`. Set strict TypeScript, ES modules, a Node-compatible module resolution setting, and a production output directory. Add graceful shutdown for HTTP, Redis, jobs, and database connections.

## Environment variables

Frontend `.env.local` contains only public configuration:

```dotenv
VITE_API_BASE_URL=/api/v1
API_PROXY_TARGET=http://localhost:3001
```

`API_PROXY_TARGET` is for the Vite development proxy. It is not a production rewrite. Restart Vite after changing environment values. An absolute `VITE_API_BASE_URL` must use HTTPS except on localhost.

Backend-only `.env` should include:

```dotenv
NODE_ENV=development
PORT=3001
APP_ORIGIN=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=REPLACE_ME
SUPABASE_SERVICE_ROLE_KEY=REPLACE_ME
DATABASE_URL=postgresql://REPLACE_ME
REDIS_URL=redis://localhost:6379
SESSION_SECRET=REPLACE_WITH_A_RANDOM_SECRET
CONNECTOR_ENCRYPTION_KEY=REPLACE_WITH_A_RANDOM_32_BYTE_KEY
ANTHROPIC_API_KEY=REPLACE_ME
AI_MODEL=SET_AN_AVAILABLE_MODEL_ID
SANDBOX_API_KEY=REPLACE_ME
PREVIEW_BASE_DOMAIN=YOUR_ISOLATED_PREVIEW_DOMAIN
PAYSTACK_SECRET_KEY=sk_test_REPLACE_ME
PAYSTACK_PLAN_PRO_MONTHLY=REPLACE_ME
PAYSTACK_PLAN_PRO_YEARLY=REPLACE_ME
PAYSTACK_PLAN_TEAM_MONTHLY=REPLACE_ME
PAYSTACK_PLAN_TEAM_YEARLY=REPLACE_ME
RESEND_API_KEY=REPLACE_ME
EMAIL_FROM=KodarCrystal <accounts@YOUR_VERIFIED_DOMAIN>
SENTRY_DSN=OPTIONAL
```

Add provider OAuth client IDs/secrets and approved callbacks as each integration is implemented. Use Supabase's appropriate client-side publishable/legacy anon key for identity requests and the service-role key only for controlled server operations. A service-role key bypasses RLS: the API must still perform membership checks. Use a separate migration database role; the runtime role should not own tables or be able to alter schemas.

Never prefix database passwords, service-role keys, AI/payment keys, connector secrets, or encryption keys with `VITE_`. Never commit actual `.env`, `.dev.vars`, provider secrets, or passwords. The renamed `.example` email and preview domains in demo copy are placeholders; provision the real domains and replace them before launch.

## Database schema

Use UUID primary keys, `timestamptz` timestamps in UTC, foreign keys, and migration files. Keep project identity separate from editable names. Do not use the browser's demo IDs as authoritative backend IDs.

| Table | Essential fields and constraints |
| --- | --- |
| `profiles` | `id` references `auth.users(id)`, `name`, `avatar_object_key`, `created_at`, `updated_at`; email/verification remain managed by identity |
| `workspaces` | `id`, `name`, `owner_id`, `created_at`, `updated_at` |
| `workspace_members` | `workspace_id`, `user_id`, `role` (`owner`, `admin`, `editor`, `viewer`); unique workspace/user |
| `workspace_invites` | `id`, workspace, email, role, hashed invitation token, inviter, expiry, accepted timestamp |
| `folders` | `id`, `workspace_id`, `name`; project folder must belong to the same workspace |
| `projects` | `id`, `workspace_id`, `created_by`, `folder_id`, `name`, `description`, `app_type`, `visibility`, `status`, `initial_prompt`, `created_at`, `updated_at`, optional deletion timestamp |
| `project_messages` | `id`, `project_id`, `user_id`, role, text, attachment references, optional `build_id`, timestamp |
| `builds` | `id`, project, requested_by, prompt, mode, effort, provider/model, status, reserved/max/actual credits, token counts, error code/message, timestamps, idempotency key |
| `build_events` | `id`/sequence, `build_id`, event type, safe payload, timestamp; index build/sequence for reconnect |
| `project_versions` | `id`, project, build, parent version, immutable artifact key/checksum, manifest, commit message, timestamp |
| `project_files` | version, normalized relative path, object key, content hash, size; unique version/path |
| `credit_ledger` | `id`, workspace, build/payment, type (`grant`, `reserve`, `settle`, `release`, `refund`), integer amount, unique source/event, timestamp |
| `subscriptions` | workspace, provider/customer/subscription/plan identifiers, plan, status, period start/end, cancel-at-period-end |
| `payment_events` | provider, unique event/payment reference, amount in kobo, currency, event status, processed timestamp |
| `api_keys` | id, workspace, creator, label, public prefix, token hash, scopes, last_used_at, expires_at, revoked_at |
| `connectors` | id, workspace, provider, external account, encrypted credentials/refresh token, scopes, status, expiry, timestamps |
| `connector_tool_events` | connection/build/user, tool, decision, redacted input/result, status, timestamp |
| `community_submissions` | id, project, submitter, title, description, URL, category, moderation status, reviewed_by, timestamps |
| `community_likes` | user, submission; unique pair |
| `deployments` | id, project/version, provider, target, status, external deployment id, URL, error, timestamps |
| `exports` | id, project/version, format, status, storage key, expiry, timestamps |
| `user_preferences` | user, notification settings, default effort, cost warnings; theme stays in the root frontend ThemeProvider |
| `audit_events` | actor, workspace, action, target, request ID, redacted metadata, timestamp |

Enable RLS on every user-owned table and storage bucket. Membership is the authorization boundary. Viewers read; editors mutate projects; admins manage integrations/members; owners manage billing/deletion. Explicitly restrict updates to role, owner, credit, payment, and subscription fields to server operations. Community reads must include only approved public projects and reviewed fields.

Index `(workspace_id, updated_at, id)` for project pagination, `(project_id, created_at)` for messages/versions, `(build_id, sequence)` for events, and provider IDs for subscriptions/payment events. Add unique scoped idempotency keys and webhook references. Use a transaction to create a profile/workspace/owner membership once after signup; invitations must not create duplicate membership.

Use a transaction and row locks for credit reservations and settlement. Ledger entries are append-only. Compute balances from the ledger or update a materialized balance in the same transaction. Two simultaneous build requests must not spend the same available credits. Deleting a project must revoke shares, stop pending jobs, and schedule object cleanup without losing required billing/audit records.

## API contract

All paths below are relative to `/api/v1`. JSON success responses use `{ "data": ... }`. Paginated responses put `{ "items": [...], "nextCursor": null }` inside `data`. UUIDs are strings; dates are ISO 8601 UTC; currency amounts are integers in minor units. Use `204` with no body for completed deletions and actions returning no data.

Errors use this shape, with a request ID also logged on the server:

```json
{"error":{"code":"INSUFFICIENT_CREDITS","message":"Not enough credits for this build.","details":{}},"requestId":"request-identifier"}
```

Use 400/422 for invalid input, 401 for no/expired session, 403 for missing permissions, 404 for unavailable resources, 409 for conflicts, 429 for limits, and 500/503 for server/provider failures. Never return stacks, raw provider credentials, or sensitive logs.

| Method and path | Behavior / response |
| --- | --- |
| `GET /health` | Public liveness: `data: {status: "ok", version: "..."}`; add a private readiness check for database/queue |
| `GET /auth/csrf` | Create/bind an anonymous/session CSRF context; `data: {token}` |
| `GET /auth/session` | `data: {user: null}` or `{user: {id,email,name,avatarUrl,emailVerified}}` |
| `POST /auth/signup` | `{email,name,password}`; create identity and return `{verificationId}` without a logged-in session |
| `POST /auth/verify` | `{verificationId,code}`; validate actual expiring verification challenge; establish cookie session; return session data |
| `POST /auth/resend` | `{verificationId}`; server-enforced cooldown and rate limit; 204 |
| `POST /auth/login` | `{email,password,rememberMe}`; authenticate with Supabase; establish cookie session; return session data |
| `POST /auth/logout` | Revoke session/provider refresh token, clear cookie; 204 |
| `POST /auth/forgot-password` | `{email}`; always return generic success; send recovery only when applicable; 204 |
| `POST /auth/reset-password` | `{token,password}`; validate a one-time expiring recovery challenge; invalidate old sessions; 204 |
| `GET /auth/oauth/:provider/start` | Start OAuth with state/PKCE and an approved return URL; redirect to provider |
| `GET /auth/oauth/:provider/callback` | Validate state/PKCE and redirect; establish session; never accept an arbitrary return URL |
| `GET, POST /workspaces` | List memberships / create workspace |
| `GET /workspaces/:id/members` | Authorized member list |
| `POST /workspaces/:id/invites` | Invite with server-enforced role rules |
| `GET /projects?workspaceId=UUID&cursor=...` | Authorized projects: `{items,nextCursor}`; match `projectSchema` |
| `POST /projects` | `{workspaceId,name,description,appType,visibility,prompt}` plus `Idempotency-Key`; return project DTO |
| `GET, PATCH, DELETE /projects/:id` | Fetch, rename/change visibility, delete; authorize by ID and workspace membership |
| `POST /projects/:id/duplicate` | New UUID and independent version history; `Idempotency-Key`; return project DTO |
| `GET, POST /projects/:id/messages` | Paginated chat / persist user message and attachments |
| `POST /projects/:id/builds` | `{prompt,effort,mode,maxCredits}` plus `Idempotency-Key`; enqueue and return 202 build DTO |
| `GET /builds/:id` | `{id,projectId,status,creditsUsed,previewUrl,error}` |
| `GET /builds/:id/events` | Authenticated SSE, resumable via Last-Event-ID; fall back to polling |
| `POST /builds/:id/cancel` | Idempotent cancellation; return current build DTO |
| `GET /projects/:id/versions` | Immutable version list |
| `POST /projects/:id/versions/:versionId/restore` | Create a new version from an old artifact; never overwrite history |
| `POST /projects/:id/shares` | Issue a revocable, limited, hashed share token |
| `GET /shares/:token` | Sanitized permitted project/preview data; never expose app credentials |
| `GET /usage?workspaceId=UUID` | `{creditsRemaining,creditsUsed,periodStart,periodEnd}`; add daily breakdown separately |
| `GET, PATCH /me` | Real profile and preferences |
| `POST /uploads` | Validate type/size/purpose and return constrained signed upload URL |
| `GET, POST /api-keys` / `DELETE /api-keys/:id` | List metadata, create (show secret once), revoke |
| `GET, POST /connectors` / `DELETE /connectors/:id` | Inspect, authorize, disconnect; encrypted tokens remain on server |
| `PATCH /connectors/:id/scopes` / `POST /connectors/:id/sync` | Enforce requested scopes and refresh tool metadata |
| `GET /community` / `POST /community/submissions` | Approved feed / queued moderation submission |
| `POST /community/:id/remix` | Authorized copy with a new project ID |
| `GET /billing/plans` / `POST /billing/checkout` | Authoritative prices and entitlements / Paystack checkout URL |
| `POST /billing/portal` | Controlled billing-management flow supported by the selected provider |
| `POST /webhooks/paystack` | Public provider webhook; raw-body signature validation and idempotent processing |
| `POST /projects/:id/exports` / `GET /exports/:id` | Queue export / return progress and an expiring download URL |
| `POST /projects/:id/deployments` / `GET /deployments/:id` | Publish an immutable version / return status |
| `DELETE /me` / `DELETE /workspaces/:id` | Reauthentication, owner rules, cancellation, retention-aware deletion workflow |

Only health/auth/projects/builds/usage currently have frontend service helpers. Add helpers and Zod schemas for the other endpoints as those features are implemented. Server request validation is required even when the frontend validates input.

Supabase OTP length/templates may differ from the six-digit demo UI. Either configure the provider accordingly or update the UI and contract together. The current `123456` code is a demo constant and must never be valid as a universal production code.

## Sessions, cookies, and browser connection

Keep Supabase access/refresh tokens in an encrypted server session or a secure server-side session store. Issue an opaque `HttpOnly`, `Secure`, `SameSite=Lax` cookie in production with an expiry. Use host-only cookies; do not put the session on a parent domain shared with generated previews. Refresh identity tokens server-side. Apply Origin checks and session-bound CSRF tokens to unsafe methods, including login/signup where appropriate. Rotate the session and CSRF context after authentication and privilege changes.

For localhost, use a development cookie configuration compatible with HTTP. For cross-site deployments, `SameSite=None; Secure` may be necessary and third-party cookie restrictions can break the flow; same-origin routing avoids that problem. Never use wildcard CORS with credentials. Allow only configured frontend origins, `Content-Type`, `X-CSRF-Token`, and `Idempotency-Key`, the required methods, and credentialed preflight requests.

Create the integration client once per browser application instance (for example in an app provider). Do not share a user-specific API/CSRF client globally between SSR requests:

```ts
import { createApiClient } from '@/lib/backend/client';
import { getApiBaseUrl } from '@/lib/backend/config';
import { createBackendServices } from '@/lib/backend/services';

let csrfToken: string | undefined;
const api = createApiClient({ baseUrl: getApiBaseUrl(), getCsrfToken: () => csrfToken });
const backend = createBackendServices(api);
csrfToken = (await backend.auth.csrf()).token;
const session = await backend.auth.session();
// After login/verification, refresh CSRF if the server rotates it.
```

Relative fetches are designed for the browser. SSR data loading needs an absolute internal API URL and explicit forwarding of the incoming request's session cookie using a request-scoped client. Do not use another visitor's QueryClient or credentials. Do not send service-role keys in HTML or serialized route data.

Use TanStack Query in migrated screens:

```tsx
const projects = useQuery({
  queryKey: ['projects', workspaceId],
  queryFn: ({ signal }) => backend.projects.list(workspaceId, signal),
  enabled: Boolean(workspaceId && session.user),
});
const rename = useMutation({
  mutationFn: ({ id, name }: { id: string; name: string }) => backend.projects.update(id, { name }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] }),
});
```

Show loading, empty, validation, error, and retry states. On 401, clear the session and private query caches and navigate to login. On logout, cancel outstanding requests, clear private caches, revoke the server session, and notify other tabs. Never fall back to `signIn()` or mock data after a failed real request. Read-only GET requests can retry; build/checkout/export mutations need server idempotency before they can be retried.

## Migration map for this codebase

| Existing module | Replace with |
| --- | --- |
| `lib/auth.ts`, `AuthGate`, `Navbar` | Server-derived reactive session, real user profile, server logout and cache clearing |
| `routes/login.tsx`, `signup.tsx`, `verify.tsx` | Async auth services, verification challenge ID, server errors/cooldowns, OAuth redirects |
| `routes/forgot-password.tsx`, `reset-password.tsx` | Real recovery delivery and URL token validation; no unconditional success timers |
| `lib/projects.ts`, `routes/dashboard.tsx`, `ProjectCard` | Project queries/mutations, server UUIDs, signed shares, real activity/usage |
| `ProjectIntakeDialog`, `routes/builder.tsx`, `SiteBlueprint` | Persist intake, submit plan/build jobs, display authoritative cost estimates |
| `WorkspacePage`, `WorkspaceModes`, `PreviewFrame` | Load selected project ID, persist messages, stream/poll jobs, isolated preview URLs, real files/versions |
| `routes/results.tsx` | Actual project/version metadata, real export jobs/downloads, functional tab panels |
| `routes/settings.tsx`, `SettingsExtras` | Profile/upload/preferences/member/API-key/billing endpoints |
| `MCPConnectionsPanel`, `MCPDetailsDrawer`, `MCPActivity` | Server-authorized connections, per-tool scopes, sync status, audit events; retain shared lazy wrapper |
| `CommunityFeed`, `routes/community.tsx` | Paginated approved submissions, likes, moderation, and permission-checked remix |
| `routes/pricing.tsx` and demo billing lists | One server-defined set of plans, currency, intervals, features, and prices |

Keep module-scope React.lazy and Suspense boundaries. Do not move providers, secrets, Node SDKs, workers, filesystem access, or generated-code execution into browser bundles. Current local actions remain simulated until these migrations are implemented. Local demo projects are untrusted browser data; if importing them later, validate and recreate them under the authenticated user's workspace with new server IDs.

## AI generation, credits, previews, and exports

1. Authenticate the user, authorize workspace membership, validate prompt/context/attachments, and enforce request size and concurrency limits.
2. Calculate a server-side estimate from model pricing and plan entitlements. The frontend effort multipliers are illustrative. Require user acceptance of an authoritative maximum credit charge.
3. In a transaction reserve credits and create a unique build/job. Queue only after durable database state exists; use an outbox or reconciliation to avoid abandoned reservations when Redis fails.
4. Have the worker generate structured plans/file operations against the selected immutable version. Validate the provider output against schemas, normalize paths, prohibit traversal/secret writes, and use an approved dependency policy.
5. Build/typecheck the generated project in an isolated sandbox. Limit CPU, memory, wall time, network egress, artifact size, and attempts. Never run arbitrary generated code inside the API process or on the developer machine.
6. Persist files and an immutable version before marking the build successful. Emit safe progress events, including model, token counts, time, and actual credits. Store actionable failures separately from sensitive provider logs.
7. Settle the reservation exactly once, release unused credits, and handle cancelled/failed jobs consistently. Reconcile timed-out workers and orphan jobs periodically.
8. Publish a preview on a separate origin using constrained access. Embed it in a sandboxed iframe with a limited CSP; never inject generated HTML into the authenticated application document.
9. Export only verified immutable artifacts. Start with React and HTML; Flutter and editable Figma exports need separate implementations. A button that shows “Exported” without a file is not a completed export.
10. Deploy only through user-authorized provider scopes, store deployment credentials encrypted, and track status/webhooks. Do not call a deployment successful until the provider confirms it.

For SSE, enforce session/membership on every connection, send keep-alives, set proxy buffering/timeout rules, and support reconnect event IDs. Preserve drafts on disconnect. Polling `backend.builds.get` is a workable first implementation.

## Billing and MCP requirements

Paystack checkout must initialize on the server using a server-defined NGN plan and trusted workspace/customer identity. Keep all money in kobo. Verify the Paystack signature against the **raw** request body, compare amounts/currency/customer/reference, and persist a unique event before granting entitlements or credits. A checkout return URL is not proof of payment. Handle retries, failed renewals, cancellation, refunds, disputes, and duplicate/out-of-order webhooks. Reconcile subscription state periodically.

API tokens must be cryptographically random, scoped, expiring/revocable, and stored as hashes. Show the full value once. Never let the current demo “Reveal key” behavior reveal stored production secrets.

Encrypt connector access/refresh tokens with a maintained key and key-rotation plan. Validate OAuth state and exact redirect URLs. Enforce per-tool permissions at execution time and log redacted actions. Validate custom MCP endpoints against SSRF: block private, loopback, link-local, and metadata addresses, recheck DNS/redirect targets, require TLS, and set time/size limits. Untrusted MCP/tool content must not override authorization rules.

## Implementation sequence and launch verification

1. **Identity and persistence:** health, session/CSRF, real signup/login/verification/recovery/logout, migrations/RLS, default workspace, project CRUD. Then migrate AuthGate, dashboard, and project links.
2. **Generation:** worker, reservations/ledger, plan/build API, streaming or polling, files/versions, isolated previews. Then migrate builder/workspace/results and implement real downloadable exports.
3. **Billing:** authoritative plans, Paystack test checkout, signed webhooks, usage/limits, cancellation/refunds. Verify repeated webhook delivery cannot grant credits twice.
4. **Secondary features:** profile/preferences, team roles/invites, uploads, API keys, connectors/MCP, moderation/remix, deployments. Only advertise functionality that is actually enabled.
5. **Operations:** staging integration tests, budget controls, backups/restores, job reconciliation, monitoring, production secrets, real policy/contact pages, and rollback.

Test at least: two users cannot read/change each other's private projects; duplicate names do not affect sibling cards; expired sessions and disabled storage fail correctly; recovery/OTP expires and cannot be reused; concurrent builds cannot overdraw credits; duplicate jobs/webhooks do not repeat charges; cancellations release reservations; provider timeouts surface errors; uploads/traversal/SSRF are rejected; previews cannot access app cookies; deletes remove artifacts/shares; staging restore works; mobile and desktop flows run without hydration or console errors.

Run the frontend's typecheck, unit/API-client tests, lint, production build, and browser smoke checks before deployment. Run backend integration tests against a disposable database and test provider accounts. CI should install from the committed lockfile and run migrations on staging before production promotion. Keep rollback-compatible migrations and do not run destructive production migrations automatically.

Production completion requires functioning provider accounts and the screen migrations above. The frontend preparation and this document provide the connection points and implementation plan; they do not make simulated accounts, payments, or generation real.
