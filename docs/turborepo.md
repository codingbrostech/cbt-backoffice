# Turborepo in Our Monorepo

## 1. What Is Turborepo?

Turborepo is a build system for JavaScript and TypeScript monorepos. Instead of manually running tasks across multiple packages, Turborepo reads the dependency graph between your packages, runs tasks in the correct order (dependencies first), and caches results so unchanged work is never repeated. In our repo, **pnpm workspaces** define which folders are packages, and **Turborepo** orchestrates how tasks run across them.

Three concepts to know:

| Concept              | Plain-language explanation                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Tasks**            | Named scripts (`build`, `lint`, `dev`) that Turborepo runs across every package.                                     |
| **Dependency graph** | Turborepo knows which packages depend on which, so it builds them in the right order.                                |
| **Caching**          | If the source files haven't changed, Turborepo replays the previous output instantly instead of re-running the task. |

---

## 2. Our Monorepo Architecture

### Workspace tree

```
cbt-backoffice/
├── apps/
│   └── backoffice/      # The admin portal app, TanStack Start, brand from BRAND at runtime
│
├── packages/
│   ├── api-schema/      # orval-generated MGT API clients
│   ├── config/          # Shared ESLint, TypeScript, Prettier, Vitest, and Storybook configs
│   └── portal/          # The portal itself: pages, layouts, hooks, stores, i18n
│
├── turbo.json           # Root task definitions
├── pnpm-workspace.yaml  # Declares apps/* and packages/* as workspaces
└── package.json         # Root scripts that call `turbo run <task>`
```

### Dependency graph

```
apps/backoffice ──▶ packages/portal ──▶ packages/api-schema
       │                   │
       └───────────────────┴──▶ packages/config
```

The app depends on `packages/portal` (consumed as source) and, through it, on `packages/api-schema` (built by tsdown). Every workspace depends on `packages/config` via `devDependencies` for the shared ESLint, TypeScript, Prettier, Vitest, and Storybook presets.

### How `workspace:*` works

In a `package.json`, you'll see dependencies like:

```json
"dependencies": {
  "@cbt-bo/config": "workspace:*"
}
```

`workspace:*` tells pnpm "resolve this from the local monorepo, not npm." This means changes to `config` are picked up immediately, no publishing step required. The config package compiles to `dist/` with tsdown, which is why the root `postinstall` builds it.

---

## 3. How Turborepo Runs Tasks

### Task definitions in `turbo.json`

Every task our repo can run is defined in the root `turbo.json`. Here's a simplified, annotated example:

```jsonc
// turbo.json (root)
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"], // 1. Build dependencies first
      "inputs": ["$TURBO_DEFAULT$", "!**/*.md"], // 2. Ignore markdown for caching
      "outputs": [".output/**", "dist/**"], // 3. What to store in cache
    },
    "dev": {
      "cache": false, // 4. Never cache (long-running process)
      "persistent": true, // 5. Keeps running until you stop it
    },
  },
}
```

### Key fields explained

| Field        | What it does                                                                               |
| ------------ | ------------------------------------------------------------------------------------------ |
| `dependsOn`  | Tasks that must finish **before** this one starts.                                         |
| `^build`     | The `^` prefix means "run `build` in my **dependencies** first" (not in the same package). |
| `inputs`     | Files Turborepo watches to decide if the cache is still valid.                             |
| `outputs`    | Files/folders Turborepo saves into the cache after the task succeeds.                      |
| `cache`      | Set to `false` to skip caching entirely (useful for `dev` servers and code generators).    |
| `persistent` | Set to `true` for long-running processes like dev servers that don't exit on their own.    |

### What happens when you run `pnpm build`

1. `pnpm build` calls `turbo run build` (defined in root `package.json`).
2. Turborepo reads every package's `package.json` to build the dependency graph.
3. It **topologically sorts** the packages — dependencies come first.
4. `packages/config` has no workspace deps, so it builds first.
5. Both apps build last (they depend on config). TanStack Start's Vite build writes `.output/` per app.
6. At each step, Turborepo checks the cache. If `inputs` haven't changed, it **replays the cached `outputs`** instead of running the script — often finishing in milliseconds.

### All our tasks

| Task              | `dependsOn`       | Cached? | Persistent? | Notes                            |
| ----------------- | ----------------- | ------- | ----------- | -------------------------------- |
| `build`           | `^build`          | Yes     | No          | Outputs: `.output/**`, `dist/**` |
| `lint`            | `^build`, `^lint` | Yes     | No          |                                  |
| `lint:fix`        | `^build`          | No      | No          | Mutates files, can't cache       |
| `check:types`     | `^check:types`    | Yes     | No          |                                  |
| `dev`             | —                 | No      | Yes         | Long-running dev servers         |
| `test`            | `^build`          | No      | No          | Outputs: `coverage/**`           |
| `format`          | `^build`          | No      | No          | Mutates files, can't cache       |
| `storybook`       | —                 | No      | Yes         | Long-running Storybook servers   |
| `build:storybook` | `^build`          | Yes     | No          | Outputs: `storybook-static/**`   |

---

## 4. Caching — How It Works

### What gets cached and what doesn't

- **Cached**: `build`, `lint`, `check:types` — deterministic tasks whose output depends only on source files.
- **Not cached**: `dev` (long-running), `test` (we want fresh runs), `format` and `lint:fix` (mutate files).

### How the fingerprint is computed

Turborepo decides whether to use a cached result by computing a **fingerprint** (hash) for each task. The fingerprint has two levels — if either changes, the cache misses:

1. **Global hash** — shared across ALL tasks. Computed from:
   - `turbo.json` (root config)
   - Lockfile (`pnpm-lock.yaml`)
   - Files listed in `globalDependencies` (none in our repo currently)
   - Environment variables listed in `globalEnv` (none in our repo currently)

2. **Task hash** — unique per task. Computed from:
   - Contents of files matched by `inputs` (e.g., all git-tracked files minus `**/*.md`)
   - Values of environment variables listed in `env` (none configured in our repo)
   - The task definition itself from `turbo.json` (changing `dependsOn`, `outputs`, etc. triggers a miss)

Turborepo is **content-addressed** — it hashes file _contents_, not timestamps. Touching a file without changing its content won't invalidate the cache.

### What invalidates the cache

Here are concrete examples grounded in our repo:

| Change                                         | Cache effect                                             | Why                                                                                                                                                                                             |
| ---------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edit a `.ts` file in `packages/config/`        | Cache miss for `config`'s `build` **and** every app task | App tasks depend on `^build`, so when `config` rebuilds, both apps must re-run.                                                                                                                 |
| Update `pnpm-lock.yaml` (add or upgrade a dep) | **All** cached tasks miss                                | The lockfile is part of the global hash — any change invalidates every task.                                                                                                                    |
| Edit root `turbo.json`                         | **All** cached tasks miss                                | `turbo.json` is part of the global hash.                                                                                                                                                        |
| Change a `.md` file                            | **No** cache miss for `build`, `lint`, or `check:types`  | All three tasks exclude markdown via `"inputs": ["$TURBO_DEFAULT$", "!**/*.md"]`.                                                                                                               |
| Change a `.env` file                           | **No** cache miss                                        | `.env` is gitignored (excluded from default inputs) and not listed in `globalDependencies`. **Note:** this is a current gap — if env vars affect build output, the cache won't know. See below. |

### Environment variables and caching

Turborepo provides two keys for including environment variables in the cache fingerprint:

- **`env`** (per-task) — variables that affect a specific task's output.
- **`globalEnv`** (all tasks) — variables that affect every task.

Example of how you'd configure them:

```jsonc
{
  "globalEnv": ["CI", "NODE_ENV"],
  "tasks": {
    "build": {
      "env": ["API_BASE_URL", "FEATURE_FLAGS"],
    },
  },
}
```

**Current state of our repo:** We have **no** `env` or `globalEnv` configured. This means environment variable changes are completely invisible to the cache. If you change `API_BASE_URL` and rebuild, Turborepo will replay the old cached output with the old URL baked in.

**Framework detection:** Turborepo automatically detects Vite projects and includes their framework-prefixed env vars (`VITE_*`) in the task hash. This provides baseline coverage for our apps without explicit configuration, but any non-prefixed env vars still need to be listed manually.

### Inputs: what Turborepo watches

#### Default behavior

Turborepo considers **all files tracked by git** as inputs. Files in `.gitignore` (like `.env*`, `node_modules/`, `dist/`) are excluded automatically — you never need to list them.

> _"By default, all files checked into source control are considered. Certain files are always treated as inputs regardless of configuration: package.json, turbo.json, and package manager lockfiles."_

#### The `$TURBO_DEFAULT$` microsyntax

When you explicitly set `inputs`, Turborepo **opts out** of its default behavior. To keep the defaults _and_ customize, start the array with `$TURBO_DEFAULT$`:

```jsonc
// Our pattern — keep defaults, but ignore markdown changes
"inputs": ["$TURBO_DEFAULT$", "!**/*.md"]
```

> _"You can use the `$TURBO_DEFAULT$` microsyntax to fine-tune the default inputs behavior while maintaining Turborepo's standard input handling. This allows you to restore the default behavior that respects your .gitignore file and follows changes tracked by source control, while also excluding specific files that you know don't affect the task's output."_

#### Common gotcha

Without `$TURBO_DEFAULT$`, your custom list **replaces** the defaults entirely:

```jsonc
// WRONG — only watches test files, ignores source changes
"test": { "inputs": ["tests/**"] }

// CORRECT — extends defaults, adds test files
"test": { "inputs": ["$TURBO_DEFAULT$", "tests/**"] }
```

---

#### Always-included inputs

These are included regardless of configuration:

- `package.json`
- `turbo.json`
- Package manager lockfile (`pnpm-lock.yaml`)

### Outputs: what gets stored

When a task succeeds, Turborepo caches the files listed in `outputs`. On a cache hit, these files are restored from cache instead of being rebuilt.

| Task               | Cached outputs                              |
| ------------------ | ------------------------------------------- |
| `build` (apps)     | `.output/**`                                |
| `build` (packages) | `dist/**`                                   |
| `build:storybook`  | `storybook-static/**`                       |
| `test`             | `coverage/**` (but task itself is uncached) |

---

## 5. Package-Level `turbo.json`

### Why we use them

Not every task rule belongs in the root config. `packages/config` must build itself before it can lint or format, because its own `eslint.config.ts` imports the compiled presets. A package-level `turbo.json` keeps that rule next to the package that owns it.

### How they work

A package-level `turbo.json` must include `"extends": ["//"]` to inherit from the root config. The `//` is a special token meaning "the root of the monorepo."

> _"Add a turbo.json file in any package with an extends key pointing to the root configuration. The extends array must start with `["//"]` to reference the root directory. You can override existing tasks or define new package-specific tasks."_

### Our package-level config

**`packages/config/turbo.json`** adds the package's own `build` as a dependency of `lint` and `format`:

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "extends": ["//"],
  "tasks": {
    "format": {
      "dependsOn": ["build", "^build"]
    },
    "lint": {
      "dependsOn": ["build", "^build", "^lint"]
    }
  }
}
```
