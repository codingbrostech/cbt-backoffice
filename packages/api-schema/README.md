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

## Exports

```ts
// Base URL, set once at app boot
import { setApiBaseUrl } from '@cbt-bo/api-schema/fetcher';

// Models
import type { AdminResult } from '@cbt-bo/api-schema/bo-fm/models';
import type { MgtAcscRewardPushLogItem } from '@cbt-bo/api-schema/bo-so/models';

// Tag-specific request functions
import { mgtServiceAdminList } from '@cbt-bo/api-schema/bo-fm/admin';
import { mgtServiceAcscRewardPushLogList } from '@cbt-bo/api-schema/bo-so/acsc';
```

The generated request functions use the native `fetch` API via the `fetcher.ts` mutator. The mutator prefixes the base URL registered through `setApiBaseUrl` and resolves with `{ data, status, headers }` for every HTTP status, throwing only when the body is not JSON.

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
