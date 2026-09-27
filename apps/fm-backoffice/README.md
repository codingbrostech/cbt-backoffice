# fm-backoffice

FM Backoffice, a [TanStack Start](https://tanstack.com/start) app.

```bash
cp .env.example .env   # MGT_BASE_URL and MGT_SITE_ID
pnpm dev:fm            # http://localhost:3001
```

Routes live under `src/routes`. TanStack Router regenerates `src/routeTree.gen.ts` on build and in dev. Add integrations with `pnpm dlx @tanstack/cli add <id>` from this directory.

## Layout

```
src/
├── routes/          __root (env + providers), login, _authenticated (session guard), _authenticated/dashboard
├── pages/           one folder per page: <Name>Page plus its hooks and forms
├── api/             actions for endpoints only this brand has (empty until one is needed)
├── hooks/           use-logout, use-session-expiry
├── i18n/            i18next setup and the en/zh resources
├── constants/       paths and storage keys
├── utils/           remember-me and error helpers
└── server/          runtime-env server function and its cached loader
```

UI components come from `@cbt-bo/component-lib`. Add shadcn components from `packages/component-lib`, not here. Shared actions, query options, the session store and the preferences store come from `@cbt-bo/api`. Its generated imports go through `@cbt-bo/api-schema/bo/*`, which this app maps to `bo-fm` in `tsconfig.json` and `vite.config.ts`.
