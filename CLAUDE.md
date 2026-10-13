# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Development (all apps/packages)
pnpm dev

# One app
pnpm dev:so   # so-backoffice on http://localhost:3001
pnpm dev:fm   # fm-backoffice on http://localhost:3000

# Build all
pnpm build

# Lint all
pnpm lint

# Type check all
pnpm check:types

# Run tests (unit + Storybook browser tests, needs `pnpm exec playwright install chromium` once)
pnpm test

# Storybook
pnpm storybook
pnpm build:storybook

# Format and auto-fix lint (run before committing)
pnpm tidy
pnpm tidy:so   # one app, also type checks
pnpm tidy:fm
```

### Package-Specific Commands

```bash
pnpm --filter so-backoffice build
pnpm --filter fm-backoffice test
pnpm --filter @cbt-bo/config build       # rebuild shared presets after editing packages/config
pnpm --filter @cbt-bo/api-schema build   # rebuild the API clients after editing packages/api-schema/src
pnpm --filter @cbt-bo/component-lib storybook       # shared UI Storybook on http://localhost:6008
pnpm --filter @cbt-bo/api test                       # shared actions, queries and stores
pnpm --filter @cbt-bo/api check:types                # type-checks the shared code against bo-fm and bo-so
pnpm gen:api                             # regenerate both MGT clients from the OpenAPI specs
```

### TanStack CLI

`so-backoffice` was scaffolded with `@tanstack/cli create` and keeps its `.cta.json`. Add an integration from that app's directory and review the regenerated files with `git diff`. `fm-backoffice` is a plain Vite app and takes no add-ons:

```bash
cd apps/so-backoffice
pnpm dlx @tanstack/cli@latest create --list-add-ons
pnpm dlx @tanstack/cli@latest add <id>
```

## Architecture

This is a **Turborepo monorepo** using pnpm workspaces.

```
cbt-backoffice/
├── apps/
│   ├── so-backoffice/    # Solaire Online admin portal (TanStack Start)
│   └── fm-backoffice/    # FUNaloMAX admin portal (Vite SPA on React Router)
└── packages/
    ├── api/              # shared MGT actions, query options and stores, one folder per tag (auth, admin-role, ...) plus preferences/ for shared client state
    ├── api-schema/       # Orval-generated MGT clients (bo-fm, bo-so) + the `mgt` request layer
    ├── config/           # shared configs (eslint, typescript, prettier, vitest, storybook)
    └── component-lib/    # shared UI: shadcn/ui set, theme css, react-hook-form field bindings
```

### Apps

`so-backoffice` is a [TanStack Start](https://tanstack.com/start) app on React 19, Vite 8, and Nitro. `fm-backoffice` is a plain Vite 8 single-page app on React 19 and [React Router](https://reactrouter.com) in declarative mode. Both share these conventions:

- `#/*` resolves to `src/*` (package.json `imports` plus tsconfig `paths`). `@cbt-bo/component-lib/*` resolves to `packages/component-lib/src/*` and `@cbt-bo/api/*` to `packages/api/src/*`. `@cbt-bo/api-schema/bo/*` is the brand-neutral alias for the generated client. Each app maps it to its own brand in `tsconfig.json` `paths` (for `tsc`) and in `vite.config.ts` `resolve.alias` (for the bundle), so shared code in `packages/api` compiles against `bo-fm` in one app and `bo-so` in the other.
- Styling is Tailwind CSS v4. `src/styles.css` imports `@cbt-bo/component-lib/styles.css`, which carries the theme and registers the component-lib package as a Tailwind source. shadcn/ui components live in `packages/component-lib/src/components/ui` (vendored, excluded from lint), never in the apps.
- Page-level forms compose the field bindings from `@cbt-bo/component-lib/components/forms/*`. A form stays beside its page (`src/pages/<page>/` in so-backoffice, `src/routes/app/<page>/` in fm-backoffice) when its markup or behavior is specific to that page or brand. A form that is otherwise identical across both apps, such as `LoginForm`, moves into `@cbt-bo/component-lib/forms/*` itself and takes its display copy through a `labels` prop instead of calling `useTranslation` itself, since the shared package carries no i18n dependency. Each page resolves `t()` and passes that `labels` object. Brand-specific copy, such as `login.title`, still comes from each app's own i18n resources even after the form moves.
- TanStack Query, Table, and Form are wired through `src/integrations` and the router context.
- `initMgtClient(env)` from `@cbt-bo/api/client` points the generated client at the MGT origin and registers the session headers. The token lives in `localStorage` (zustand `persist` in `@cbt-bo/api/auth/store`, key `SESSION_STORAGE_KEY`), so every session check runs on the client.
- The display timezone is a shared preference. The authenticated layout hydrates `usePreferencesStore` from `@cbt-bo/api/preferences/store` beside the session store and passes `timezoneMinutes` plus its setter to `AppHeader`, so `TimezoneClock` stays a controlled component and other pages read the same offset.
- Login error titles resolve through i18n by code: `login.error.code.<code>` with `login.error.fail` as fallback.
- Vitest config lives in the `test` field of `vite.config.ts` through the `@cbt-bo/config/vitest` factories.

`so-backoffice` (TanStack Start):

- File-based routes live in `src/routes`. `src/routeTree.gen.ts` is generated by the router plugin and committed.
- Server routes use `createFileRoute` with `server.handlers`, for example `src/routes/api/health.ts`.
- The root route `beforeLoad` reads `MGT_BASE_URL` and `MGT_SITE_ID` through a server function and returns them as router context. `src/server/runtime-env.ts` holds that server function plus `loadRuntimeEnv`.
- Auth is route-based. `src/routes/_authenticated.tsx` is a pathless layout with `ssr: false` whose `beforeLoad` resolves `sessionQueryOptions()` from `@cbt-bo/api/auth/queries` and redirects to `/login` when there is no user. `/login` redirects the other way.
- TanStack Query is wired through `src/integrations` and the router context.
- `vite build` produces `.output/`; `node .output/server/index.mjs` starts the server on `PORT`. The test config comes from `createTanstackStartTestConfig`.

`fm-backoffice` (React Router):

- `index.html` loads `src/main.tsx`, which calls `initMgtClient(loadRuntimeEnv())` with `VITE_MGT_BASE_URL` and `VITE_MGT_SITE_ID` from `src/utils/runtime-env.ts`, hydrates the session, preferences and page-tabs stores, then renders `QueryClientProvider`, `BrowserRouter` and `App`. `src/App.tsx` initialises i18n, mounts the session-expiry listener and renders `AppRoutes` with the toaster.
- The `src/routes` layout mirrors `cbt-host-mgt-bo`: `src/routes/index.tsx` declares the whole tree with `<Routes>`, `src/routes/login/index.tsx` is the login page with its hooks beside it, and `src/routes/app/` holds `Layout.tsx`, `components/` for the shell parts (`Header`, `NavSide`, `Content`) and one folder per page with an `index.tsx`. The index redirects to the dashboard, and the pathless `AppLayout` route wraps every page plus a `*` route for `NotFoundPage`. Pages still under construction share `PlaceholderPage` through `PLACEHOLDER_PATHS`.
- Auth is component-based. `AppLayout` reads `sessionQueryOptions()` with `useQuery`, renders `PageSpinner` while pending and `<Navigate>` to `buildLoginHref(currentHref)` without a user, and otherwise composes `Header`, `NavSide` and `Content` around the `Outlet`. `LoginPage` does the reverse through `buildPostLoginHref`.
- `vite build` writes a static bundle to `dist/`. Serve it with history fallback to `index.html`. There is no server layer, so no server routes or server functions. The test config comes from `createReactAppTestConfig`.

### Internal Dependencies

Packages reference each other via `workspace:*` under the `@cbt-bo/*` scope. Both apps depend on `@cbt-bo/config` and `@cbt-bo/api-schema`, which tsdown builds on `postinstall`, and on `@cbt-bo/component-lib` and `@cbt-bo/api`, which are consumed as TypeScript source through their package.json `exports`. Every package is `private` and the only `version` field lives in the root `package.json`.

## Code Standards

- **ESLint**: Zero warnings policy (`--max-warnings 0`). Presets from `@cbt-bo/config/eslint` combine the repo rules with the TanStack toolchain (`flat/tanstack`, `flat/router`, `flat/react-query`).
- **TypeScript**: Strict mode enabled, `verbatimModuleSyntax`
- **React**: Version 19

Repo-wide writing and coding conventions live in `.claude/rules/`. See `writing-style.md` for prose and documentation style, and `coding-conventions.md` for test naming, comments, and code structure.

## Documentation Verification

When suggesting library, framework, or API usage, verify against current docs first. The full workflow lives in `.claude/rules/verify-library-docs.md`.

## Requirements

- Node.js >=24
- pnpm 12.3.4
