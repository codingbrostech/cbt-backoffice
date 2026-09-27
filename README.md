# cbt-backoffice

A **Turborepo monorepo** for the CBT backoffice apps using pnpm workspaces.

## What's inside?

### Apps and Packages

- `apps/so-backoffice`: Solaire Online admin portal, a [TanStack Start](https://tanstack.com/start) app
- `apps/fm-backoffice`: FUNaloMAX admin portal, a [TanStack Start](https://tanstack.com/start) app
- `packages/component-lib`: Shared UI consumed as source by both apps (shadcn/ui set, theme stylesheet, react-hook-form field bindings, PageSpinner). Page forms live in the apps.
- `packages/api-schema`: Generated MGT API clients plus the `@cbt-bo/api-schema/mgt` request layer (`createMgtAction`, `ApiError`)
- `packages/api`: Hand-written MGT actions, query options and stores shared by both apps, consumed as source and brand-neutral through the `@cbt-bo/api-schema/bo/*` alias
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
- Playwright Chromium for Storybook tests: `pnpm exec playwright install chromium`

### Install

```bash
pnpm install
```

`postinstall` builds `@cbt-bo/config` and `@cbt-bo/api-schema`, which the apps import from `dist/`.

### Configure an app

Each app reads the MGT API settings from the server environment at request time. Copy the example file and adjust it.

```bash
cp apps/fm-backoffice/.env.example apps/fm-backoffice/.env
cp apps/so-backoffice/.env.example apps/so-backoffice/.env
```

| Variable       | Purpose                                |
| -------------- | -------------------------------------- |
| `MGT_BASE_URL` | Origin of the MGT API for this brand   |
| `MGT_SITE_ID`  | Value sent in the `X-Tgpx-Site` header |

### Develop

```bash
# All apps/packages
pnpm dev

# One app
pnpm dev:so    # http://localhost:3000
pnpm dev:fm    # http://localhost:3001
```

### Build

```bash
# All packages
pnpm build

# One app
pnpm build --filter=so-backoffice
```

### Lint, Type Check & Test

```bash
pnpm lint
pnpm check:types
pnpm test
```

### Regenerate the API clients

```bash
pnpm gen:api         # both MGT targets, then rebuild the package
pnpm gen:api:bo:fm   # FM only
pnpm gen:api:bo:so   # SO only
```

### Add a TanStack integration

Each app was scaffolded with the [TanStack CLI](https://github.com/tanstack/cli) and keeps its `.cta.json`. Run the CLI from the app directory to add an integration, then review the regenerated files with `git diff`.

```bash
cd apps/so-backoffice
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
feat(auth, so-backoffice): add user login functionality

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

---

## Useful Links

- [Turborepo Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Turborepo Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [TanStack Start](https://tanstack.com/start/latest/docs/framework/react/overview)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Conventional Comments](https://conventionalcomments.org/)
