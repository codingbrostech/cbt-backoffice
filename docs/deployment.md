# Deployment Walkthrough

Every push to `main` or `release/**` gets exactly one Docker image for its tip commit, `ghcr.io/codingbrostech/cbt-backoffice:sha-<commit>`, built by the **Image Build** workflow (any other branch can get one via manual dispatch). Deploying means pushing a tag, and the deploy workflow re-tags that prebuilt image in seconds instead of rebuilding it. Re-tagging just adds a new name pointing at content already in the registry, so what you tested is byte-for-byte what ships.

A build names its image `sha-<commit>` and nothing more. Deploying is what puts a real tag on it, and the nightly **Cleanup** workflow keeps an image only while a pushed remote git tag references it. Two consequences to plan around:

- An image not deployed the same day it was built gets collected that night, there is no age threshold. Redeploying such a commit later pays the full build once.
- A deployed image survives exactly as long as its deploy tag exists on origin. Deleting a superseded tag hands its image to that night's run, so keep tags whose environments still pin them.

## Table of Contents

- [Quick Reference](#quick-reference)
- [What Runs in the Container](#what-runs-in-the-container)
- [cbt-deploy Coordination](#cbt-deploy-coordination)
- [Before You Deploy](#before-you-deploy)
- [Scenario: Deploy a Release Branch to dev](#scenario-deploy-a-release-branch-to-dev)
- [Scenario: Deploy to uat](#scenario-deploy-to-uat)
- [Scenario: Release Day (prd)](#scenario-release-day-prd)
- [Scenario: Manual Dispatch (dev only)](#scenario-manual-dispatch-dev-only)
- [Cutover from cbt-play-web](#cutover-from-cbt-play-web)
- [Troubleshooting](#troubleshooting)

---

## Quick Reference

Tag format: `v<version>-<target>-<env>.<increment>`, for example `v1.2.3-so-bo-dev.1`.

A free-form suffix after the increment is allowed (letters, digits, and hyphens only, since the tag name becomes a Docker tag). Suffixed tags still trigger the right workflow and still count for auto-increment.

| Target  | Brand (`BRAND`) | Image                                   | Environments      | Tag examples                               |
| ------- | --------------- | --------------------------------------- | ----------------- | ------------------------------------------ |
| `so-bo` | `SO`            | `ghcr.io/codingbrostech/cbt-backoffice` | `dev` `uat` `prd` | `v1.2.3-so-bo-dev.1`, `v1.2.3-so-bo-uat.1` |
| `fm-bo` | `FM`            | `ghcr.io/codingbrostech/cbt-backoffice` | `dev` `uat` `prd` | `v1.2.3-fm-bo-dev.1`, `v1.2.3-fm-bo-prd.1` |

Both targets re-tag the same image. Which brand a deployment serves is its `BRAND` environment variable.

The version part follows the root `package.json` `version`. Bump it in a `chore: release vX.Y.Z` commit on `main` and tag that commit `vX.Y.Z` so the deploy workflows' `core_version` auto-detect keeps working.

Two rules that always apply:

- **Push one tag per `git push`, back to back with no waiting.** Multi-tag pushes are unreliable, and beyond 3 tags GitHub drops the event entirely.
- **Never re-point an existing tag.** Push the next increment instead.

## What Runs in the Container

The image is `apps/backoffice/.output/` on `node:24-alpine`, started as a non-root user with:

```bash
node .output/server/index.mjs
```

| Variable              | Read        | Purpose                                                                |
| --------------------- | ----------- | ---------------------------------------------------------------------- |
| `BRAND`               | per request | `SO` or `FM`, picks the brand tokens, portal name and brand-only pages |
| `PORT`                | at startup  | Listen port, `3000` in the image                                       |
| `HOST`                | at startup  | Bind address, `0.0.0.0` in the image                                   |
| `MGT_BASE_URL`        | per request | MGT API origin, served to the browser through the root route loader    |
| `MGT_SITE_ID`         | per request | MGT site id sent with every API call                                   |
| `CLIENT_SITE_LOCALES` | per request | Comma-separated player locales offered in locale-aware forms           |

`BRAND` and the MGT variables are read on each request by the `getRuntimeEnv` server function, so changing them needs a pod restart but never a rebuild. `GET /api/health` returns `{ "status": "ok", "brand": "SO" }` for the readiness and liveness probes, and `503 { "status": "misconfigured" }` when `BRAND` is missing or unknown, so a misconfigured pod never becomes ready. Pages fail their root loader in the same case.

## cbt-deploy Coordination

The manifests in `codingbrostech/cbt-deploy` need one deployment per brand, exactly like the `apps/backoffice` deployment in `cbt-play-web`. Compared with it:

| Setting               | `cbt-play-web` backoffice                                        | `cbt-backoffice`                                                         |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Image                 | `ghcr.io/codingbrostech/cbt-play-web:<tag>` shared by three apps | `ghcr.io/codingbrostech/cbt-backoffice:<tag>`, one image for both brands |
| Start command         | `pnpm --filter ./apps/backoffice start`                          | Image `CMD`, nothing to override                                         |
| Brand                 | `BRAND` env at runtime                                           | `BRAND` env at runtime, unchanged                                        |
| Env                   | `BRAND`, `MGT_BASE_URL`, `MGT_SITE_ID`, `CLIENT_SITE_LOCALES`    | unchanged                                                                |
| Port                  | `3000`                                                           | `3000` (`PORT`)                                                          |
| Health                | `GET /api/health`                                                | `GET /api/health`                                                        |
| `repository_dispatch` | `cbt-play-web-so-backoffice-image-update-trigger` (and `fm-`)    | `cbt-backoffice-so-backoffice-image-update-trigger` (and `fm-`)          |
| Payload               | `{ buildenv, buildtag }`                                         | `{ buildenv, buildtag }`, unchanged                                      |

The new `event_type` names let both deployments coexist while the environments switch over one at a time. The dispatch token comes from the same GitHub App (`DISPATCH_APP_ID` / `DISPATCH_APP_PRIVATE_KEY` secrets), so those secrets and `SLACK_BOT_TOKEN` must be copied to this repo before the first deploy.

## Before You Deploy

1. Make sure the commit you want to deploy is pushed.
2. Make sure **Image Build** is green for that commit, so the deploys take the seconds-long re-tag path:

   ```bash
   gh run list --workflow=build.yaml --branch release/20260723 --limit 3
   ```

   Tagging before that run finishes is safe. Image Build queues every run for the same commit in one group, so the deploy's `Ensure Image` waits for the in-flight build and then skips its own.

3. Find the next increment for your version, target, and environment:

   ```bash
   git fetch --tags
   git tag -l "v1.2.3-so-bo-dev.*"
   ```

   If `v1.2.3-so-bo-dev.2` is the highest existing tag, the next deploy is `.3`.

## Scenario: Deploy a Release Branch to dev

Example: deploy the tip of `release/20260723` to `dev` for both brands, version `1.2.3`.

1. Tag the commit once per target:

   ```bash
   git tag v1.2.3-so-bo-dev.1 origin/release/20260723
   git tag v1.2.3-fm-bo-dev.1 origin/release/20260723
   ```

2. Push each tag separately, no waiting between pushes:

   ```bash
   git push origin v1.2.3-so-bo-dev.1
   git push origin v1.2.3-fm-bo-dev.1
   ```

3. Each tag fires its own deploy run, named `Deploy v1.2.3-so-bo-dev.1 by @you`. Watch them on the Actions page or with:

   ```bash
   gh run list --limit 5
   gh run watch <run-id>
   ```

4. Confirm the result:
   - The `Ensure Image` job's probe step logs `✅ Image sha-<commit> already exists, skipping build`, and its `Build` job is skipped
   - A Slack build card appears with the tag and changelog. The Changes field covers commits since the previous deploy tag of the same target and env, grouped by conventional-commit type, with commits scoped to the other app left out
   - The `cbt-deploy` repo receives the dispatch and rolls out the environment

> **Deploy tags must point at a branch tip.** A tag on a mid-history commit is rejected by the `Reject non-tip deploy tag` step before any image is built. To deploy such a commit, point a branch at it and re-tag, or deploy via dispatch (dev only).

## Scenario: Deploy to uat

Identical to the dev scenario with `uat` in the tag:

```bash
git tag v1.2.3-so-bo-uat.1 origin/release/20260723
git push origin v1.2.3-so-bo-uat.1
```

The increment counts per environment, so `v1.2.3-so-bo-uat.1` is valid even when dev is already at `v1.2.3-so-bo-dev.4`.

> **Protect uat and prd tags with a ruleset.** `cbt-play-web` restricts creation, update, and deletion of `v*-uat.*` and `v*-prd.*` tags to a bypass list through its `deploy-tag-protection` ruleset. Recreate that ruleset on this repo before the first uat deploy. Inspect it with `gh api repos/codingbrostech/cbt-backoffice/rulesets --jq '.[] | select(.target=="tag")'`.

## Scenario: Release Day (prd)

Prd tags fall under the same tag ruleset as uat, so the pusher must be an account on its bypass list.

1. Rebase and merge the release PR into `main` with the `chore: release vX.Y.Z` commit on top, and tag that commit `vX.Y.Z`.
2. The push to `main` triggers Image Build for the commit. Waiting for it is recommended so a failure surfaces before you tag:

   ```bash
   gh run list --workflow=build.yaml --branch main --limit 1
   ```

3. Tag the `main` commit for every target, then push each tag separately:

   ```bash
   git fetch origin main
   git tag v1.2.3-so-bo-prd.1 origin/main
   git tag v1.2.3-fm-bo-prd.1 origin/main

   git push origin v1.2.3-so-bo-prd.1
   git push origin v1.2.3-fm-bo-prd.1
   ```

4. Both deploys re-tag the `sha-<commit>` images that were just built, so production ships exactly the bytes that were tested.

## Scenario: Manual Dispatch (dev only)

Each dev deploy workflow can also be run without tagging anything yourself. It computes the next increment, creates and pushes the tag, then deploys.

- **UI**: Actions → pick the workflow (for example `so-bo-dev.yaml`) → Run workflow → choose the branch → fill `core_version`.
- **CLI**:

  ```bash
  gh workflow run so-bo-dev.yaml --ref release/20260723 -f core_version=1.2.3
  ```

Two constraints apply:

- **Dispatch cannot deploy uat or prd** once the tag ruleset is in place. The workflow pushes its tag as `github-actions[bot]`, which has no bypass, so the ref creation is rejected with `GH013` before any image or deploy step.
- **`core_version` is required until a bare `vX.Y.Z` tag exists.** Leaving it empty makes the workflow auto-detect from bare `vX.Y.Z` tags, so the run fails at the version step while the repo has none.

## Cutover from cbt-play-web

The old `apps/backoffice` keeps shipping from `cbt-play-web` until every environment runs the new apps. Switch one environment at a time, dev first:

1. Add the two `cbt-backoffice` deployments (one per `BRAND`) to `cbt-deploy` for the environment, pointing at the new image and listening for the new `event_type` names, with the same `BRAND` and `MGT_*` values the old deployments use.
2. Deploy both brands with a `-dev.N` tag and verify login, a list page with search, an export, and a write action against the environment's MGT.
3. Move the environment's ingress from the old backoffice service to the new ones, then scale the old deployment down.
4. Repeat for `uat`, then `prd`.
5. After prd has run on the new apps for a release cycle, remove `apps/backoffice`, its `fm-bo-*` / `so-bo-*` workflows, and the old `cbt-deploy` deployments in separate PRs.

## Troubleshooting

### Pushed tags but no workflow ran

You pushed multiple tags in one `git push`. Batches have been observed in this org to trigger only the first tag's workflow, and beyond 3 tags GitHub drops the event entirely.

> _"Events will not be created for tags when more than three tags are pushed at once."_
>
> Source: [GitHub Docs, Webhook events and payloads, push](https://docs.github.com/en/webhooks/webhook-events-and-payloads#push)

Fix: delete the unfired tags from the remote, then re-push them one at a time.

```bash
git push origin --delete v1.2.3-so-bo-dev.1
git push origin v1.2.3-so-bo-dev.1
```

### Deploy built an image instead of skipping

The `Ensure Image` job ran a build job instead of skipping it, because the probe found no `sha-<commit>` image for that app. Either Image Build never ran for that commit, or the commit was never deployed and a later Cleanup collected its prebuilt image. The deploy still succeeds, but next time trigger Image Build first:

```bash
gh workflow run build.yaml --ref <branch>
```

This is always the case for commits on branches other than `main` and `release/**` (for example `develop` and `dev/*`), which are excluded from automatic image builds.

### Container exits with `Cannot find module 'react'`

The `.output/` folder was built without `traceDeps: ['react', 'react-dom']` in `apps/backoffice/vite.config.ts`, so the `use-sync-external-store` shim's runtime `require("react")` has nothing to resolve against. The `Smoke test standalone server output` step in `pr-checks.yml` and `build.yaml` fails on this before an image is pushed. Keep `traceDeps` in the config.

### Tagged the wrong commit

Do not delete and re-push the tag at the same name. Tag the right commit with the **next increment** and push that instead.
