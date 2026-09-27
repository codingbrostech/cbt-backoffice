# @cbt-bo/api-schema

Generated TypeScript API clients and models for the MGT (backoffice) API, powered by [Orval](https://orval.dev/).

## Setup

Copy the example env file and fill in the spec URLs:

```bash
cp .env.example .env.local
```

| Variable       | dev                                  | uat                              |
| -------------- | ------------------------------------ | -------------------------------- |
| BO_FM_SPEC_URL | `https://adminapi-fm.int.cbtdev.com` | `https://adminapi-fm.cbtuat.com` |
| BO_SO_SPEC_URL | `https://adminapi-so.int.cbtdev.com` | `https://adminapi-so.cbtuat.com` |

## Code Generation

```bash
# Generate both targets
pnpm gen:api

# Generate a single target
pnpm gen:api:bo-fm   # FM backoffice (MGT)
pnpm gen:api:bo-so   # SO backoffice (MGT)
```

Orval reads the OpenAPI spec from each URL, applies transformers (service-tag removal), and outputs `tags-split` mode code into `src/generated/<app>/`. Post-generation hooks collapse individual model files into a single barrel and create `index.ts` barrels for each tag folder.

## Build

```bash
pnpm build
```

[tsdown](https://github.com/rolldown/tsdown) scans all app directories under `src/generated/` and produces ESM output with `.d.ts` declarations in `dist/`.

## Request layer

`@cbt-bo/api-schema/mgt` wraps the generated functions for the apps. Configure it once at boot, then wrap any generated function with `createMgtAction`.

```ts
import { ApiError, configureMgtClient, createMgtAction } from '@cbt-bo/api-schema/mgt';
import { mgtServiceAuthLogin } from '@cbt-bo/api-schema/bo-fm/auth';

configureMgtClient({
  getAuthToken: () => sessionStore.getState().token,
  getSiteId: () => 'tgpxloc',
  onUnauthorized: () => window.dispatchEvent(new Event('session-expired'))
});

export const login = createMgtAction(mgtServiceAuthLogin);
```

- The action adds `Authorization: Bearer <token>` when a token is present and always adds `X-Tgpx-Site`.
- A 2xx response resolves with the envelope `data`. Anything else throws an `ApiError` with `status`, `body`, `detail` and the numeric MGT `code`, read from the body `code` field or parsed from a `10009: ...` message prefix, falling back to `ERROR_GENERAL`.
- A 401, or a body with code `UNAUTHORIZED_API_CODE`, on a request that carried a token calls `onUnauthorized` once. `resetSessionExpiredFlag()` arms it again after a fresh login.
- `getApiErrorCode`, `getApiErrorMessage` and `formatApiErrorMessage` read a thrown value for toasts and i18n lookups.

## Exports

```ts
// Base URL, set once at app boot
import { setApiBaseUrl } from '@cbt-bo/api-schema/fetcher';

// Request layer
import { createMgtAction } from '@cbt-bo/api-schema/mgt';

// Models
import type { AdminResult } from '@cbt-bo/api-schema/bo-fm/models';
import type { MgtAcscRewardPushLogItem } from '@cbt-bo/api-schema/bo-so/models';

// Tag-specific request functions
import { mgtServiceAdminList } from '@cbt-bo/api-schema/bo-fm/admin';
import { mgtServiceAcscRewardPushLogList } from '@cbt-bo/api-schema/bo-so/acsc';
```

The generated request functions use the native `fetch` API via the `fetcher.ts` mutator. The mutator prefixes the base URL registered through `setApiBaseUrl` and resolves with `{ data, status, headers }` for every HTTP status, throwing only when the body is not JSON.

## Brand-neutral alias

Code that serves both brands, such as `packages/api`, imports `@cbt-bo/api-schema/bo/*` instead of naming `bo-fm` or `bo-so`. This package does not export that path. Each consumer maps it to a brand:

```jsonc
// tsconfig.json, for tsc and the editor
"paths": { "@cbt-bo/api-schema/bo/*": ["../../packages/api-schema/dist/bo-so/*/index"] }
```

```ts
// vite.config.ts, for the bundle
resolve: { alias: { '@cbt-bo/api-schema/bo': '@cbt-bo/api-schema/bo-so' } }
```

The two generated clients come from the same backend. At the time of writing 38 of the 40 shared tags are identical, `player` and `payment` each differ by one endpoint, and a few tags exist in one brand only. Shared code that touches a brand-only function or field fails the other app's `check:types`.

## Generated Structure

```
src/generated/
├── bo-fm/               # FM backoffice API (MGT)
│   ├── models/          # Shared TypeScript types
│   └── tags/            # One folder per API tag
│       ├── admin/
│       ├── player/
│       └── ...
└── bo-so/               # SO backoffice API (MGT)
    ├── models/
    └── tags/
        ├── acsc/
        ├── admin/
        └── ...
```
