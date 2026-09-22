# cbt-backoffice

A **Turborepo monorepo** for the CBT backoffice apps using pnpm workspaces.

## What's inside?

### Apps and Packages

- `apps/backoffice`: The admin portal app, a [TanStack Start](https://tanstack.com/start) shell that serves Solaire Online (`BRAND=SO`) or FUNaloMAX (`BRAND=FM`) depending on its environment
- `packages/portal`: The admin portal itself (pages, layouts, hooks, stores, i18n, shadcn/ui)
- `packages/api-schema`: Orval-generated MGT API clients and the fetch mutator
- `packages/config`: Shared configurations (ESLint, TypeScript, Prettier, Vitest, Storybook)

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting (zero warnings policy)
- [Prettier](https://prettier.io) for code formatting
- [Vitest](https://vitest.dev/) with [Storybook](https://storybook.js.org/) browser tests

## Getting Started

### Requirements

- Node.js >=24
- pnpm 12.3.4 (`corepack enable` picks it up from `packageManager`)
- Playwright Chromium for Storybook tests: `pnpm --filter @cbt-bo/portal exec playwright install chromium` (the portal workspace pins the Playwright version the tests run with)

### Install

```bash
pnpm install
```

### Develop

The app reads the brand and the MGT API settings from the server environment. Copy `apps/backoffice/.env.example` to `apps/backoffice/.env` for the shared values, and put `BRAND` plus `MGT_BASE_URL` in `apps/backoffice/.env.so` and `apps/backoffice/.env.fm`.

```bash
# All apps/packages
pnpm dev

# One brand
pnpm dev:so    # BRAND=SO, http://localhost:3000
pnpm dev:fm    # BRAND=FM, http://localhost:3001

# Portal component stories
pnpm --filter @cbt-bo/portal storybook   # http://localhost:6008
```

### Build

```bash
# All packages
pnpm build

# The app only
pnpm build --filter=backoffice
```

### Lint, Type Check & Test

```bash
pnpm lint
pnpm check:types
pnpm test
```

### Run the production build

```bash
pnpm build --filter=backoffice
PORT=3000 BRAND=SO MGT_BASE_URL=https://... MGT_SITE_ID=... node apps/backoffice/.output/server/index.mjs
```

### Docker

The root `Dockerfile` packages `apps/backoffice/.output/`. Build the app first, then:

```bash
docker build -t backoffice:local .
docker run --rm -p 3000:3000 -e BRAND=SO -e MGT_BASE_URL=https://... -e MGT_SITE_ID=... backoffice:local
```

### Add a TanStack integration

The app was scaffolded with the [TanStack CLI](https://github.com/tanstack/cli) and keeps its `.cta.json`. Run the CLI from the app directory to add an integration, then review the regenerated files with `git diff`.

```bash
cd apps/backoffice
pnpm dlx @tanstack/cli@latest create --list-add-ons
pnpm dlx @tanstack/cli@latest add <id>
```

---

## Contributing

### Branch Naming Convention

Branch names follow the commit type pattern:

| Type       | Prefix      | Example                   |
| ---------- | ----------- | ------------------------- |
| `feat`     | `feature/`  | `feature/add-user-auth`   |
| `fix`      | `fix/`      | `fix/login-validation`    |
| `docs`     | `docs/`     | `docs/update-readme`      |
| `style`    | `style/`    | `style/format-components` |
| `refactor` | `refactor/` | `refactor/auth-module`    |
| `perf`     | `perf/`     | `perf/optimize-queries`   |
| `test`     | `test/`     | `test/add-unit-tests`     |
| `build`    | `build/`    | `build/update-deps`       |
| `ci`       | `ci/`       | `ci/add-github-actions`   |
| `chore`    | `chore/`    | `chore/cleanup-configs`   |
| `revert`   | `revert/`   | `revert/broken-feature`   |

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

- bullet point describing change 1
- bullet point describing change 2

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Examples**:

```
feat(auth, backoffice): add user login functionality

- Add login form component
- Integrate with auth API
- Add session management

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Pull Request Process

1. Create a branch following the naming convention
2. Make your changes and commit using conventional commits
3. Push and create a PR targeting `main`
4. PR title must follow conventional commit format: `<type>[scope]: <description>`
5. Fill out the PR template with:
   - High Level Description
   - Key Changes & Design Decisions
   - Screenshots (if UI changes)

### Squash Merge

When merging PRs, use **squash merge** with:

- **Commit title** = PR title (conventional commit format)
- **Commit body** = PR description

### Code Review Comments

Review comments follow the [Conventional Comments](https://conventionalcomments.org/) pattern:

```
<type>[optional scope]: <description>

[optional body]
```

**Comment Types**:

| Type         | Description                             |
| ------------ | --------------------------------------- |
| `fix`        | Must be fixed before merging (blocking) |
| `suggestion` | Recommended improvement (non-blocking)  |
| `question`   | Clarification needed                    |
| `nitpick`    | Minor style issue (non-blocking)        |
| `praise`     | Highlighting good code                  |
| `thought`    | Sharing an idea for consideration       |

**Comment Scopes**: `security`, `perf`, `types`, `style`, `srp`, `dry`, `consistency`

**Examples**:

```
fix(security): Sanitize user input before rendering

suggestion(srp): Consider splitting this component into smaller pieces

praise: Great use of composition here!
```

---

## Documentation

- [Git Workflow](docs/git-workflow.md): branch strategy and merge rules for a linear history
- [Turborepo](docs/turborepo.md): how tasks, the dependency graph, and caching work in this monorepo
- [Deployment](docs/deployment.md): images, deploy tags, `cbt-deploy` settings, and the cutover from `cbt-play-web`
- [GitHub Actions](.github/workflows/README.md): what each workflow does and how the caches and images fit together

---

## Useful Links

- [Turborepo Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Turborepo Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [TanStack Start](https://tanstack.com/start/latest/docs/framework/react/overview)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Conventional Comments](https://conventionalcomments.org/)
