# backoffice

The admin portal app, a [TanStack Start](https://tanstack.com/start) shell around `@cbt-bo/portal`. The brand comes from the `BRAND` environment variable at request time, so one build serves both Solaire Online (`SO`) and FUNaloMAX (`FM`).

```bash
pnpm dev        # reads .env, http://localhost:3000
pnpm dev:so     # reads .env then .env.so, http://localhost:3000
pnpm dev:fm     # reads .env then .env.fm, http://localhost:3001
```

Copy `.env.example` to `.env` (shared values) and put the per-brand values (`BRAND`, `MGT_BASE_URL`) in `.env.so` and `.env.fm`. `vite dev --mode <brand>` loads the matching file on top of `.env`.

Routes live under `src/routes`. TanStack Router regenerates `src/routeTree.gen.ts` on build and in dev. Add integrations with `pnpm dlx @tanstack/cli add <id>` from this directory.
