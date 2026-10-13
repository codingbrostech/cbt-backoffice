# fm-backoffice

FM Backoffice, a [Vite](https://vite.dev) single-page app on [React Router](https://reactrouter.com).

```bash
cp .env.example .env   # VITE_MGT_BASE_URL and VITE_MGT_SITE_ID
pnpm dev:fm            # http://localhost:3000
```

`index.html` loads `src/main.tsx`, which reads the env, points the MGT client at it, hydrates the session, preferences and page-tabs stores, then renders `App`, which mounts the route tree from `src/routes/index.tsx`. `pnpm build` writes a static bundle to `dist/`. Serve it with every unknown path falling back to `index.html`.

## Layout

```
src/
├── main.tsx         entry: env, MGT client, store hydration, QueryClientProvider, BrowserRouter and App
├── App.tsx          i18n init, the session-expiry listener, the route tree and the toaster
├── routes/
│   ├── index.tsx    AppRoutes, the <Routes> tree
│   ├── login/       index.tsx is the login page, hooks/ beside it
│   └── app/         Layout.tsx is the session guard + shell, components/ holds Header, NavSide and Content, one folder per page (dashboard, placeholder, not-found)
├── api/             actions for endpoints only this brand has (empty until one is needed)
├── hooks/           use-page-tabs, use-session-expiry
├── i18n/            i18next setup and the en/zh resources
├── constants/       paths, nav items and storage keys
├── lib/             TanStack Query client factory
└── utils/           runtime-env, remember-me and error helpers
```

UI components come from `@cbt-bo/component-lib`. Add shadcn components from `packages/component-lib`, not here. Shared actions, query options, the session store and the preferences store come from `@cbt-bo/api`. Its generated imports go through `@cbt-bo/api-schema/bo/*`, which this app maps to `bo-fm` in `tsconfig.json` and `vite.config.ts`.
