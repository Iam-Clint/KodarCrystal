# KodarCrystal

A prompt-to-app builder from KodarMonet Labs. The interface follows [KodarMonet](https://kodarmonet.vercel.app) and [KodarDesign](https://kodardesign.vercel.app): Inter typography, Instrument Serif accents, neutral surfaces, and shared light/dark/system theme controls.

## Run locally

Requires Node.js 22.12 or newer and pnpm 10.28.2 through Corepack.

```powershell
corepack pnpm install
corepack pnpm dev
```

Use the address printed by Vite. The intended local port is 5173. Copy `.env.example` to `.env.local` when connecting a local backend.

## Checks

```powershell
corepack pnpm typecheck
corepack pnpm test
corepack pnpm lint
corepack pnpm build
corepack pnpm start
```

## Current behavior

This is a frontend demo. Login accepts a valid email and a password of at least eight characters; signup verification uses the demo code **123456**. No real password, email, payment, provider connection, or generated code is sent to a backend.

Projects have stable IDs, can be renamed/duplicated/deleted locally, and survive reload when browser storage is available. A new build creates a local project and opens its workspace with the submitted prompt. The canvas remains a sample coffee storefront. Exports, deployment, OAuth, and MCP actions are simulated.

Theme selections share the root ThemeProvider and persist under `kodarcrystal:*` storage keys. Project links work in the current browser; cross-device sharing requires the backend share endpoint. Existing storage under the previous brand's keys is not migrated.

## Backend implementation

See [Backend.md](./Backend.md) for infrastructure, secrets, database tables, API contracts, authentication, jobs, billing, and the exact frontend migration points. A typed API client and TanStack Query provider are already available; setting an API URL does not automatically replace the mock actions.

## Stack

React 19, TypeScript, TanStack Start/Router, TanStack Query, Vite, Tailwind CSS 4, shadcn/Radix UI, and Framer Motion. Heavy Workspace, Community, and MCP content keep their lazy-loading boundaries.

Fonts are served locally; their source and licenses are in [public/fonts](./public/fonts/README.md).

Production builds default to Nitro's Node server. Use `NITRO_PRESET=vercel` (or the target adapter) in the deployment environment when deploying to a different host. The Vite `/api/v1` proxy is development-only; configure the production host to forward API requests separately.
