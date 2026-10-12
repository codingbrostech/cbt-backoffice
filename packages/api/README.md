# @cbt-bo/api

Hand-written MGT actions, TanStack Query options and stores shared by `apps/so-backoffice` and `apps/fm-backoffice`, consumed as TypeScript source. `@cbt-bo/api-schema` holds the generated clients, this package holds the code both apps write on top of them.

## Brand-neutral imports

This package never names a brand. Every generated import goes through `@cbt-bo/api-schema/bo/*`, and each app maps that path to its own client:

- `tsconfig.json` `paths` maps `@cbt-bo/api-schema/bo/*` to `packages/api-schema/dist/bo-<brand>/*/index`, so `tsc` checks this package's source against the app's brand.
- `vite.config.ts` `resolve.alias` maps `@cbt-bo/api-schema/bo` to `@cbt-bo/api-schema/bo-<brand>`, so the bundle carries the app's brand.

Both apps type-check this package on every `check:types`. Code that reads a function or a field only one brand has fails the other app's check, which is the signal to keep that code in the app instead.

`tsconfig.json` in this package points at `bo-fm` for the editor and ESLint, and `tsconfig.so.json` points at `bo-so`. `pnpm check:types` runs both.

Brand-only endpoints, for example the SO `acsc` tag, stay in the app's `src/api/` and import `@cbt-bo/api-schema/bo-so/*` directly.

## Layout

One folder per MGT tag, named in kebab-case, plus `preferences/` for the client state both apps share outside any tag.

```
src/
├── client.ts          initMgtClient(env), SESSION_EXPIRED_EVENT, IRuntimeEnv, getEnv
├── auth/
│   ├── actions.ts     login, validateToken, logout
│   ├── queries.ts     sessionQueryOptions, loginMutationOptions, signOut, ensureSession
│   ├── store.ts       useSessionStore (token persisted under SESSION_STORAGE_KEY), hydrateSessionStore
│   └── session.ts     applyAuthResult, clearSession
├── admin-role/
│   ├── actions.ts     getAllRolePermissions
│   └── queries.ts     loadCurrentRolePermissions
└── preferences/
    └── store.ts       usePreferencesStore (timezoneMinutes persisted under PREFERENCES_STORAGE_KEY), hydratePreferencesStore
```

`actions.ts` wraps generated functions with `createMgtAction`. `queries.ts` builds the `queryOptions` and `mutationOptions` the apps consume. A domain adds `store.ts` only when it owns client state.

## Adding a domain

```ts
// src/player/actions.ts
import { mgtServicePlayerList } from '@cbt-bo/api-schema/bo/player';
import { createMgtAction } from '@cbt-bo/api-schema/mgt';

export const listPlayers = createMgtAction(mgtServicePlayerList);
```

```ts
// src/player/queries.ts
import type { PlayerListInput } from '@cbt-bo/api-schema/bo/models';
import { queryOptions } from '@tanstack/react-query';

import { listPlayers } from '@cbt-bo/api/player/actions';

export const playerListQueryOptions = (input: PlayerListInput) =>
  queryOptions({ queryKey: ['player', 'list', input], queryFn: () => listPlayers(input) });
```

## Using it from an app

```ts
import { initMgtClient } from '@cbt-bo/api/client';
import { ensureSession, loginMutationOptions, sessionQueryOptions } from '@cbt-bo/api/auth/queries';
import { useSessionStore } from '@cbt-bo/api/auth/store';
import { usePreferencesStore } from '@cbt-bo/api/preferences/store';
```

Call `initMgtClient(env)` in the routes that talk to the API before the first request. The apps do this in `__root`, `login` and `_authenticated`.

## Scripts

```bash
pnpm --filter @cbt-bo/api test
pnpm --filter @cbt-bo/api lint
pnpm --filter @cbt-bo/api check:types   # once against bo-fm, once against bo-so
```
