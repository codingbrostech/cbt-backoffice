---
name: commit
description: Create commits following conventional commits. Use when user says "commit", "push", wants to save changes, or asks for commit format/template/example.
allowed-tools: Bash, Read, Grep, Glob
---

# Commit Skill

Create well-formatted commits following conventional commits specification.

## CRITICAL: Always Verify Actual State First

**NEVER rely on conversation context.** Before ANY action, you MUST run these commands to verify the actual state:

```bash
# 1. Current status
git status

# 2. Unstaged changes
git diff

# 3. Staged changes
git diff --staged

# 4. All branch changes (from target branch)
git diff develop...HEAD
```

Only proceed after reviewing the actual output from these commands.

---

## Workflow

1. **Verify state** - Run git status/diff commands above
2. **Run tidy** - `pnpm tidy --filter=<workspace>` for each workspace that has changes, or plain `pnpm tidy` for cross-cutting changes. Re-run `git status`/`git diff` afterwards so auto-fixes become part of the reviewed diff. If tidy reports errors it cannot auto-fix, stop and report them instead of committing
3. **Identify target branch** - Default is `develop` unless user specifies otherwise
4. **Find branch point** - `git merge-base HEAD <target>`
5. **Analyze complete diff** - `git diff <target>...HEAD`
6. **Review commit history** - `git log <target>..HEAD --oneline`
7. **Read key files** - Use `Read` tool for deeper context on significant changes
8. **Determine commit type** - Based on changes (feat, fix, docs, etc.)
9. **Ensure proper branch naming** - See Branch Naming Convention below
10. **Show user and confirm** - See confirmation section below
11. **Stage relevant changes only** - `git add <paths>` limited to files that belong to the commit's scope. Never `git add -A` while the tree holds unrelated changes; those stay uncommitted and are listed in the confirmation summary
12. **Create commit** - Follow the Commit Message Format below
13. **Push to remote** - `git push -u origin HEAD`

---

## Branch History Hygiene

A feature branch is a reviewable series of logical commits, not a log of the work session.

- When a correction lands on work the branch itself introduced, fold it into the commit that introduced it and force-push with `--force-with-lease`. Do not stack fix commits onto your own unmerged commits.
- Interactive rebase is unavailable in this environment. Rebuild the series with `git reset --soft <base>` and recommit the final file states group by group. When two commits touch the same file, commit an intermediate state of that file for the earlier commit, then restore the final state for the later one.
- A separate follow-up commit is right when it changes behavior that predates the branch, or when the branch is shared and rewriting would disrupt others.

---

## REQUIRED: Show User Before Committing

**STOP and show this summary before executing any git commands:**

```
Branch: <branch-name>

Commit Message:
<full commit message>

Files to commit:
- file1.ts
- file2.ts

Left uncommitted (out of scope):
- unrelated-file.ts (or "none")
```

Ask: **"Ready to commit and push?"**

Only proceed after user confirms.

---

## Branch Naming Convention

Branch names MUST follow this three-segment pattern:

```
<type-prefix>/<app-or-area>/<short-description>
```

The type prefix comes from the commit type:

| Type       | Branch Prefix | Example                           |
| ---------- | ------------- | --------------------------------- |
| `feat`     | `feature/`    | `feature/so-backoffice/user-auth`    |
| `fix`      | `fix/`        | `fix/fm-backoffice/login-bug`      |
| `docs`     | `docs/`       | `docs/deploy/runbook`             |
| `style`    | `style/`      | `style/config/formatting`  |
| `refactor` | `refactor/`   | `refactor/so-backoffice/auth`      |
| `perf`     | `perf/`       | `perf/fm-backoffice/queries`         |
| `test`     | `test/`       | `test/so-backoffice/unit-tests`   |
| `build`    | `build/`      | `build/deps/turbo-bump`           |
| `ci`       | `ci/`         | `ci/deploy/first-changelog`       |
| `chore`    | `chore/`      | `chore/skills/bff-api`            |
| `revert`   | `revert/`     | `revert/fm-backoffice/broken-feat` |

### Rules

- The middle segment names what the change targets: a workspace directory under `apps/` or `packages/` (e.g. `so-backoffice`, `fm-backoffice`, `config`), or an area for cross-cutting changes (e.g. `deploy`, `skills`, `rules`, `deps`)
- If already on a properly named branch (e.g., `feature/so-backoffice/something`), use it
- If on `develop`, `main`, or a misnamed branch, create a new branch:
  ```bash
  git checkout -b <type>/<app-or-area>/<short-description-in-kebab-case>
  ```
- Branch description should be kebab-case, **2-3 words max**
- Examples: `agents-to-skills`, `fix-login`, `add-auth`
- Avoid verbose names like `convert-commit-and-pr-agents-to-skills`

---

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<functional-scope>[, <app-or-package>]): <description>

- bullet point describing change 1
- bullet point describing change 2

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Valid Types

| Type       | Description                                           |
| ---------- | ----------------------------------------------------- |
| `feat`     | A new feature (MINOR in SemVer)                       |
| `fix`      | A bug fix (PATCH in SemVer)                           |
| `docs`     | Documentation only changes                            |
| `style`    | Code style changes (formatting, semicolons, etc.)     |
| `refactor` | Code change that neither fixes a bug nor adds feature |
| `perf`     | Performance improvement                               |
| `test`     | Adding or correcting tests                            |
| `build`    | Changes to build system or dependencies               |
| `ci`       | Changes to CI configuration                           |
| `chore`    | Other changes that don't modify src or test files     |
| `revert`   | Reverts a previous commit                             |

### Rules

- Type must be lowercase
- Scope has two parts: a required functional part (e.g. `seo`, `auth`) and an optional second part for the app or package the change targets, separated by `, ` (comma + space). For the second part, use the directory name of the affected workspace under `apps/` or `packages/` — discover current names by listing those directories (e.g. `ls apps/ packages/`). Omit the second part for cross-cutting changes (monorepo tooling, `.claude/`, root configs).
  - App-scoped: `feat(auth, so-backoffice): add login`
  - Cross-cutting: `chore(deps): bump turbo to 2.5`
- Description under 50 characters, present tense
- Body uses bullet points for clarity
- Never hard-wrap body lines. One bullet is one line, regardless of length. GitHub preserves literal newlines, so a wrapped bullet renders as broken lines in the web UI. The 72-column body convention is deliberately not used in this repo
- Always include `Co-Authored-By: Claude <noreply@anthropic.com>`

### Breaking Changes

Append "**!**" before the colon:

```
feat(api, so-backoffice)!: remove deprecated API endpoints
```

With `!`, the description itself serves as the breaking-change explanation (Conventional Commits rule 13), so write it to say what breaks. The spec's alternative `BREAKING CHANGE:` footer form is not used in this repo.

### Reverts

Use the `revert` type and reference the reverted commit SHAs in a `Refs:` footer, per the spec FAQ:

```
revert: drop the flaky bingo rebate rollout

Refs: 676104e, a215868

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Command Example

```bash
git commit -m "$(cat <<'EOF'
feat(functional-scope, app): short description

- Change 1
- Change 2
- Change 3

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```
