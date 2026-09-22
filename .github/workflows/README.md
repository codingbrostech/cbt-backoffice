# GitHub Actions Workflows

This folder is the repo's CI/CD. The one rule behind every file: **the image is built once per commit, and everything else just points names at it.** Each workflow owns one responsibility:

| Workflow                           | Responsibility                                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `build.yaml`                       | Build the app once per commit and publish `ghcr.io/codingbrostech/cbt-backoffice:sha-<commit>`       |
| `so-bo-*.yaml`, `fm-bo-*.yaml` (6) | Deploy one brand to one environment by re-tagging that prebuilt image                                |
| `pr-checks.yml`                    | Validate every PR push with lint, type check, tests, a production build, and a standalone smoke test |
| `cleanup.yaml`                     | Reclaim waste nightly, images no remote tag references plus stale Actions caches                     |

Every push to `main` or `release/**` builds one image for its tip commit, and any other branch can get one through a manual dispatch. Every deploy path re-tags that image rather than building its own, so what you tested is exactly what ships. For the deploy procedure itself (tag formats, scenarios, rollback) head over to [`docs/deployment.md`](../../docs/deployment.md).

## Image

One GHCR package, `ghcr.io/codingbrostech/cbt-backoffice`, built from the root [`Dockerfile`](../../Dockerfile). The image holds only `apps/backoffice/.output/` (the Nitro `node-server` build) on `node:24-alpine` and starts with `node .output/server/index.mjs`. Nothing is compiled inside Docker, and no `pnpm install` runs there. The same image serves both brands: the deployment sets `BRAND=SO` or `BRAND=FM`, and the app reads it at request time together with the MGT settings.

The `.output/` folder is self-contained on purpose. Nitro bundles every dependency into it, and `react` plus `react-dom` are copied into `.output/server/node_modules` through `traceDeps` in `apps/backoffice/vite.config.ts`. The `use-sync-external-store` shim inside `@tanstack/react-store` keeps a runtime `require("react")`, which only resolves when a real `react` package sits next to the server bundle. [`smoke-test-output.sh`](../scripts/smoke-test-output.sh) guards this by starting `.output/` from a temp directory outside the workspace with `BRAND=SO` and hitting `/api/health` and `/login`.

## `build.yaml`

The only place a Docker image is ever built. There are three ways in, and they all land on the same `check` job, which probes GHCR for `sha-<commit>` and skips the build when the image already exists.

| Trigger             | When                                     |
| ------------------- | ---------------------------------------- |
| `push`              | Automatic, on `main` and `release/**`    |
| `workflow_dispatch` | Manual, on any branch                    |
| `workflow_call`     | The `ensure-image` job of any deploy run |

- **Dispatch it on any branch and you get the same image a deploy would.**
  - Everything keys off `github.sha`, so building branch `X` at commit `C` yields the identical `sha-C` image
  - Dispatch only builds. It does not re-tag, notify, or reach `cbt-deploy`
- **Every run for one commit shares a queue.**
  - The concurrency group is `build-${{ github.sha }}`, deliberately not `github.ref`. A called workflow sees the caller's ref, so the same commit would otherwise split across groups
  - A caller must never declare `build-<sha>` as its own group. The caller would hold the slot while its `ensure-image` job queues behind it, and the two would wait on each other forever
- **The build job runs `pnpm build`, the standalone smoke test, then `docker buildx build`** for `linux/amd64` and `linux/arm64`
- **At build time the image carries exactly one tag, `sha-<commit>`.** Deploys add their tags to the same version later, which is how cleanup tells shipped from never shipped. Docker layer cache lives in the `buildcache` tag

The queue keying and the no-shared-group rule both come from one platform behavior:

> _"When a reusable workflow is triggered by a caller workflow, the github context is consistently associated with the caller workflow."_
>
> Source: [GitHub docs, Reusing workflow configurations](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations)

## `pr-checks.yml`

What runs when you push to a PR. Every push triggers it, and each new push cancels the previous run.

| Job              | Display name   | Runs                                                                    | Cache prefix                     |
| ---------------- | -------------- | ----------------------------------------------------------------------- | -------------------------------- |
| `lint-and-check` | `Lint & Check` | `pnpm turbo run lint check:types test`                                  | `${{ runner.os }}-turbo-checks-` |
| `build`          | `Build`        | `pnpm build` with `NODE_ENV=production`, then the standalone smoke test | `${{ runner.os }}-turbo-shared-` |

- `test` includes the Storybook browser tests, so the job installs Playwright Chromium first
- It also runs on pushes to `develop` and `dev/**` purely to keep those base branches' caches warm
- `test` sets `"cache": false` in `turbo.json`, so only `lint` and `check:types` are ever replayed
- `build` shares the `turbo-shared-` pool with `build.yaml`

## Deploy Workflows

Six per-target files that are intentionally near-identical copies. Between them only the tag pattern, `ENV`, the dispatch `event_type`, and the Slack channel and card label (`SLACK_CHANNEL`, `OTHER_APP_PREFIXES`, `TARGET_LABEL`) change. Both brands re-tag the same image; which brand a deployment serves is the `BRAND` variable on the `cbt-deploy` side. The Slack card logic itself is shared, living in [`notify-slack.sh`](../scripts/notify-slack.sh).

| Target  | Brand (`BRAND`) | Tag shape              | `event_type`                                        |
| ------- | --------------- | ---------------------- | --------------------------------------------------- |
| `so-bo` | `SO`            | `v1.2.3-so-bo-<env>.N` | `cbt-backoffice-so-backoffice-image-update-trigger` |
| `fm-bo` | `FM`            | `v1.2.3-fm-bo-<env>.N` | `cbt-backoffice-fm-backoffice-image-update-trigger` |

Four jobs each:

- `prepare` resolves the deploy tag, and on a tag push rejects one that is not a branch tip
- `ensure-image` calls `build.yaml`
- `deploy` re-tags the prebuilt image and dispatches `cbt-deploy`
- `notify` runs [`notify-slack.sh`](../scripts/notify-slack.sh), posting a Slack card with a changelog grouped by conventional-commit type. Commits scoped to the other brand are left out

`OTHER_APP_PREFIXES` filters the changelog by commit scope. Scope a commit with `so-bo` or `fm-bo` when a change only concerns one brand. Unscoped commits and `portal` scoped commits show up on both cards.

## `cleanup.yaml`

Runs nightly, by manual dispatch, or through `workflow_call`. The `images` job walks the whole GHCR package through [`cleanup-images.sh`](../scripts/cleanup-images.sh), the `caches` job walks every Actions cache in the repo.

| Job      | Keeps                                                                                                   | Deletes                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `images` | Versions a pushed remote git tag still references, `buildcache`, and child manifests of everything kept | Never-shipped `sha-<commit>` builds, versions whose git tags were deleted, and orphan manifests |
| `caches` | The newest cache per ref and key prefix                                                                 | The rest, plus every cache whose branch, PR, or tag is gone                                     |

There is no age threshold on images, so a commit's prebuilt image survives only until the first night nobody has deployed it. The `images` job refuses to delete anything when it cannot list the remote tags or mint a registry token.

## Gotchas

- A new `workflow_dispatch` trigger only works after it reaches `main`. Until then, exercise the workflow through one of its other triggers.
- Dispatch runs the selected ref's copy of the file. Pick the branch deliberately, and when in doubt pick `main`.

> _"The workflow_dispatch event enables manual triggering of workflows via the GitHub API, CLI, or UI. For this event to function, the workflow file must exist on the repository's default branch."_
>
> Source: [GitHub docs, Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)

## Reference

| Secret                                         | Used for                                                               |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| `GITHUB_TOKEN`                                 | GHCR pushes and pulls                                                  |
| `DISPATCH_APP_ID` + `DISPATCH_APP_PRIVATE_KEY` | Minting the App token scoped to `cbt-deploy`                           |
| `SLACK_BOT_TOKEN`                              | Posting the Slack build card. Without it the notify step skips posting |

Every workflow picks its Node version up from `.nvmrc` and pnpm from the root `package.json` `packageManager` field, so there is nothing to bump in this folder when either changes.
