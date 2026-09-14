---
name: pr
description: Create, update, or merge pull requests. Use when user says "create PR", "open PR", "update PR", "merge PR", "squash merge", wants to create/modify/merge a pull request, or asks for PR format/template/example.
allowed-tools: Bash, Read, Grep, Glob, mcp__github__*
---

# PR Skill

Create and update pull requests with accurate, well-formatted descriptions.

## CRITICAL: Always Verify Actual State First

**NEVER rely on conversation context.** Before ANY action, you MUST run these commands to verify the actual state:

```bash
# 1. Current status
git status

# 2. Unstaged changes (should be empty before PR)
git diff

# 3. Staged changes (should be empty - all committed)
git diff --staged

# 4. Find branch point
git merge-base HEAD develop

# 5. ALL changes in this branch from target
git diff develop...HEAD

# 6. Commit history for this branch
git log develop..HEAD --oneline
```

Only proceed after reviewing the actual output from these commands.

---

## Workflow: Creating a New PR

1. **Verify state** - Run git commands above
2. **Identify target branch** - Default is `develop` unless user specifies
3. **Analyze complete diff** - `git diff <target>...HEAD`
4. **Review commit history** - `git log <target>..HEAD --oneline`
5. **Read key files** - Use `Read` tool for deeper context
6. **Determine PR type** - Based on changes (feat, fix, docs, etc.)
7. **Check remote status** - Ensure branch is pushed
8. **Show user and confirm** - See confirmation section below
9. **Create PR** - Use `mcp__github__create_pull_request`

## Workflow: Updating an Existing PR

1. **Verify state** - Run git commands above
2. **Get PR number** - Ask user or detect from branch
3. **Analyze current changes** - Same analysis as above
4. **Show user and confirm** - See confirmation section below
5. **Update PR** - Use `mcp__github__update_pull_request`

Before updating, fold any corrections to the branch's own commits into their logical commits per the commit skill's Branch History Hygiene section, so the PR stays a clean series.

## Workflow: Merging a PR

1. **Verify state** - Run git commands above
2. **Get PR number** - Ask user or detect from current branch
3. **Show user and confirm** - See confirmation section below, and include the planned cleanup so the user sees it upfront
4. **Wait for required checks** - See [Required Checks Before Merging](#required-checks-before-merging)
5. **Squash merge** - Use `mcp__github__merge_pull_request` with `merge_method: "squash"`, formatted per [Squash Merge Instructions](#squash-merge-instructions)
6. **Run branch cleanup** - See [Branch Cleanup After Squash Merge](#branch-cleanup-after-squash-merge)

### Required Checks Before Merging

A PR with required checks still running reports `mergeStateStatus: BLOCKED` and the merge call fails. Check before merging:

```bash
gh pr view <number> --json mergeStateStatus,statusCheckRollup
```

- Checks still running: wait for them to complete (a background wait is fine), then merge
- A required check failed: stop and report the failure, do not merge
- All green: proceed

---

## REQUIRED: Show User Before Creating/Updating/Merging PR

**STOP and show this summary before executing:**

```
Action: Create PR / Update PR #<number> / Merge PR #<number>

Base: develop ← Head: <branch-name>

Title: <pr-title>

Body:
<full PR description or squash commit body>

Planned cleanup (merge only):
- Delete head branch `<branch-name>` (remote + local) after merge
- Or skip if branch is protected, or has dependent PRs
```

Ask: **"Ready to proceed?"**

Only proceed after user confirms.

---

## PR Title Format

Same as conventional commit title:

```
<type>(<functional-scope>[, <app-or-package>]): <description>
```

Example: `feat(auth, so-backoffice): add user login functionality`

For breaking changes, append `!` before the colon (e.g. `feat(api, so-backoffice)!: remove deprecated endpoints`). The PR title becomes the squash commit title on merge, so the marker must be present here to survive into history.

Scope has two parts: a required functional part (e.g. `seo`, `auth`) and an optional second part for the app or package the change targets, separated by `, ` (comma + space). For the second part, use the directory name of the affected workspace under `apps/` or `packages/` — discover current names by listing those directories (e.g. `ls apps/ packages/`). Omit the second part for cross-cutting changes (monorepo tooling, `.claude/`, root configs).

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

---

## PR Description Template

Use this exact structure:

```markdown
## High Level Description

[1-3 sentences explaining what this PR achieves]

## Key Changes & Design Decisions Made

[Explain any key decisions made during implementation]

### [Category 1]

- `Title 1`
  - Description point 1
  - Description point 2

<br>

- `Title 2`
  - Description point 1
  - Description point 2

### [Category 2]

- `Title 1`
  - Description point 1

## Screenshots

[Upload screenshots if there are UI changes, otherwise write "n/a"]
```

### Format Rules

- **Titles**: Wrap in backticks for code styling (e.g., `commit-and-pr`)
- **Descriptions**: Nested bullets under each title
- **Spacing**: Use `<br>` between items within same category
- **Categories**: Group related changes under `###` headers

### Writing the Body

- **Length budget.** Two sentences at most for the High Level Description. At most three categories, three titles in total, and two sub-bullets per title. If the body runs past roughly 150 words, cut until it fits
- **Only what changed.** Every title names something in the branch diff. Do not add a category for what was deliberately left alone, and do not justify a change that was considered and not made
- **Actual changes only.** Derive the body from the branch diff. Leave out the historical narrative behind the change (past incidents, earlier corrections, how the need was discovered). The High Level Description says what the PR changes, not how we got here
- **State the decision, not the derivation.** Give the outcome in one line. Do not walk the reader through the reasoning, the defaults you consulted, or the alternatives you weighed
- **Natural tone.** Write sub-bullets as plain sentences, the way you would explain the change to a teammate. Short sentences that still read like speech, not telegram fragments trimmed to save words
  - Write: "The flow now starts by finding the right release branch"
  - Not: "deploy ref discovery added"
- **One idea per sub-bullet.** Split a sentence that chains two thoughts
- **Backtick every code-like term.** Branch names, tags, workflow files, repo names, file paths, env and variable names (`develop`, `tag.yaml`, `core_version`, `cbt-deploy`)

---

## Squash Merge Instructions

When this PR is merged, use **squash merge** with:

- **Commit title** = PR title + PR number, e.g. `feat(functional-scope, app): description (#123)`
- **Commit body** = Concise bullet point summary of key changes

### Commit Body Format

```
- Key change 1
- Key change 2
- Key change 3

Co-Authored-By: Claude <noreply@anthropic.com>
```

Keep bullet points short and focused on what changed, not implementation details.

---

## Branch Cleanup After Squash Merge or Rehome

After a branch's content lands elsewhere, clean up the old head branch automatically. Do not wait to be asked. This applies to a squash merge and equally to a rehome or replace (content rebased onto a new branch, a release branch superseded by another).

### Protected Branches (never delete)

- `dev/*` (any branch starting with `dev/`, e.g. `dev/so-backoffice`, `dev/fm-backoffice`)
- `develop`
- `main`

If the merged head matches any of these, skip cleanup and report:

```
Skipping cleanup: `<branch>` is a protected long-lived branch.
```

**Exception for superseded `release/*`.** A `release/*` branch is protected while live, but once its content has been squash-merged, rehomed, or replaced, delete it as part of the same task (remote first). Do not leave a superseded `release/*` branch behind.

### Check for Dependent PRs

Before any deletion, list open PRs (including drafts) whose `base` is the merged branch:

```bash
gh pr list --base <merged-branch> --state open --json number,title,headRefName,isDraft
```

Equivalent MCP call: `mcp__github__list_pull_requests` with `base: <merged-branch>` and `state: "open"`.

### If Dependent PRs Exist, Offer to Retarget

1. Show the user the dependent PRs (number, title, head branch, draft flag)
2. Ask whether to retarget each one to the merged branch's original target (the base the merged PR used, typically `develop`)
3. On confirmation, retarget every dependent PR via `mcp__github__update_pull_request` with `base: <original-target>`
4. Only after all dependents are retargeted, proceed with deletion
5. If the user declines, skip the deletion, report the branch was kept, and name the dependent PRs so the user can resolve manually

### Delete the Merged Branch

Switch off the head branch first. After merging your own PR you are usually still on it, and `git branch -D` refuses to delete the checked-out branch. Land on the base branch, fast-forwarded, so the working tree shows the merged result:

```bash
git fetch origin <base>:<base>
git checkout <base>
```

Then delete, remote first:

```bash
git push origin --delete <branch>
git branch -D <branch>
```

Use `-D` (capital) because squash merges don't update git's merged-tracking, so `-d` would refuse.

Report the cleanup as part of the merge summary, e.g.:

```
Merged #123 and deleted `feat/foo` (remote + local).
```

---

## Sync Local Branches After Pushing

As the final step of any work that pushed new commits to `develop` or a `dev/*` branch (a merge, a fast-forward, a rebase via temporary checkouts), fast-forward the user's local counterparts too. Those pushes update remotes only, so untouched local copies show as behind in a git GUI.

For each affected branch that is not currently checked out (the checked-out one is already current):

```bash
git fetch origin develop:develop
```

Then verify local matches remote with a `git rev-parse <branch>` vs `git rev-parse origin/<branch>` check.

---

## GitHub MCP Tools

### Create PR

```
mcp__github__create_pull_request
  owner: Repository owner
  repo: Repository name
  title: Conventional commit format title
  body: PR description following template
  head: Current branch name
  base: Target branch (default: develop)
```

### Update PR

```
mcp__github__update_pull_request
  owner: Repository owner
  repo: Repository name
  pullNumber: PR number to update
  title: (optional) New title
  body: (optional) New description
  base: (optional) New base branch (used when retargeting dependent PRs)
```

### Merge PR

```
mcp__github__merge_pull_request
  owner: Repository owner
  repo: Repository name
  pullNumber: PR number to merge
  merge_method: "squash"
  commit_title: PR title + PR number, e.g. `feat(scope): description (#123)`
  commit_message: Squash commit body per template
```

### List PRs (for dependent-PR check)

```
mcp__github__list_pull_requests
  owner: Repository owner
  repo: Repository name
  base: Branch to check (the just-merged branch)
  state: "open"
```
