# Git Workflow

This document outlines our git workflow to maintain a **clean, linear commit history** without merge commits.

## Table of Contents

- [Branch Strategy](#branch-strategy)
- [Merge Strategies](#merge-strategies)
- [Branch Workflow](#branch-workflow)
- [Release Workflow](#release-workflow-develop--main)
- [Hotfix Workflow](#hotfix-workflow)
- [Syncing After Rebase/Squash](#syncing-after-rebasesquash)
- [Quick Reference](#quick-reference)

---

## Branch Strategy

```
main        ← Production releases (linear history)
  ↑
develop     ← Integration branch (linear history)
  ↑
<type>/*    ← Individual branches by conventional commit type
```

**Branch types** (following [Conventional Commits](https://www.conventionalcommits.org/)):

| Type       | Purpose                      | Example Branch              |
| ---------- | ---------------------------- | --------------------------- |
| `feat/*`   | New feature                  | `feat/user-auth`            |
| `fix/*`    | Bug fix                      | `fix/login-error`           |
| `docs/*`   | Documentation                | `docs/git-workflow`         |
| `refactor/*` | Code restructuring         | `refactor/api-cleanup`      |
| `chore/*`  | Maintenance tasks            | `chore/update-deps`         |
| `ci/*`     | CI configuration             | `ci/add-tests`              |
| `test/*`   | Adding/fixing tests          | `test/auth-unit-tests`      |
| `perf/*`   | Performance improvement      | `perf/optimize-queries`     |
| `style/*`  | Formatting (no code change)  | `style/lint-fixes`          |
| `build/*`  | Build system changes         | `build/webpack-config`      |

## Merge Strategies

| Merge Type         | Strategy             | Result                       |
| ------------------ | -------------------- | ---------------------------- |
| `<type>/*` → develop | **Squash and merge** | Single commit per change     |
| develop → main     | **Rebase and merge** | Preserves individual commits |

---

## Branch Workflow

### 1. Create Branch

```bash
git checkout develop
git pull
git checkout -b <type>/descriptive-name
```

**Examples:**

```bash
git checkout -b feat/user-authentication
git checkout -b fix/login-validation-error
git checkout -b docs/api-documentation
git checkout -b refactor/extract-auth-service
```

### 2. Work on Changes

```bash
# Make commits as needed
git add .
git commit -m "wip: progress on changes"
```

### 3. Open PR and Squash Merge

- Open PR: `<type>/branch-name` → `develop`
- Use **"Squash and merge"** button
- All commits become one clean commit on develop

```
BEFORE:
develop:    D1 --- D2
                    \
branch:              C1 --- C2 --- C3 (WIP commits)

AFTER SQUASH MERGE:
develop:    D1 --- D2 --- SC   (single clean commit)
```

---

## Release Workflow (develop → main)

### Step 1: Create Release PR

- Open PR: `develop` → `main`
- Use **"Rebase and merge"** button (preserves individual commits)

```
BEFORE:
main:       M1 --- M2
                    \
develop:             D1 --- D2 --- SA --- SB --- SC

AFTER REBASE AND MERGE:
main:       M1 --- M2 --- D1' --- D2' --- SA' --- SB' --- SC'
```

### Step 2: Reset develop to main

After rebase and merge, develop has old hashes. Reset it:

```bash
git checkout develop
git reset --hard main
git push --force-with-lease
```

### Step 3: Notify Team

```
@team develop has been reset to main after release.

Please run:
  git fetch origin
  git rebase origin/develop

on your feature branches before continuing work.
```

### Step 4: Team Rebases Feature Branches

Each developer with an active feature branch:

```bash
git fetch origin
git rebase origin/develop
```

---

## Hotfix Workflow

When a hotfix is pushed directly to main:

```
main:       ... --- SC' --- H1   (hotfix)
                    |
develop:    ... --- SC'          (missing hotfix)
```

### Option A: Cherry-pick (Recommended)

**Best when:** Team is actively working on feature branches

```bash
git checkout develop
git cherry-pick <hotfix-commit-hash>
git push
```

**Result:**

- Hotfix is copied to develop
- Team can continue working without any action
- No disruption to active feature branches

```
main:       ... --- SC' --- H1
                    |
develop:    ... --- SC' --- H1'   (cherry-picked copy)
                            |
feature branches still valid ────┘
```

### Option B: Reset develop to main

**Best when:** No active feature branches, or major sync needed

```bash
# 1. Announce to team
@team Syncing develop with main in 10 minutes. Please push your work.

# 2. Reset develop
git checkout develop
git reset --hard main
git push --force-with-lease

# 3. Team rebases their branches
git fetch origin
git rebase origin/develop
```

### Option C: Rebase --onto (Recommended when develop has unique commits)

**Best when:** Develop has unique commits that need to be preserved while syncing with main

```
main:       ... --- M1 --- H1   (hotfix on main)
                    |
develop:    ... --- M1 --- D1 --- D2   (unique commits on develop)
```

Use `git rebase --onto` to transplant develop's unique commits onto main:

```bash
git checkout develop
git rebase --onto origin/main <last-shared-commit> develop
git push --force-with-lease
```

**Example:**

```bash
# If M1 is the last commit shared between main and develop:
git rebase --onto origin/main M1 develop
git push --force-with-lease
```

**Result:**

```
main:       ... --- M1 --- H1
                            \
develop:                     D1' --- D2'   (unique commits rebased on top)
```

**Why this works:**

- Takes commits after `<last-shared-commit>` on develop
- Replays them onto `origin/main`
- One command instead of reset + multiple cherry-picks
- Preserves all unique work on develop

### Decision Flowchart

```
Hotfix landed on main
         │
         ▼
Does develop have unique commits to preserve?
         │
    ┌────┴────┐
    │         │
   YES        NO
    │         │
    ▼         ▼
Is team actively working    Reset develop
on feature branches?        to main (Option B)
    │                              │
 ┌──┴──┐                           ▼
 │     │                      Team rebases
YES    NO                     their branches
 │     │
 ▼     ▼
Option A    Option C
Cherry-pick Rebase --onto
hotfix      (preserves unique
to develop  commits)
 │          │
 ▼          ▼
No team     Team rebases
action      their branches
needed
```

---

## Syncing After Rebase/Squash

When someone rebases or squashes commits on a shared branch (e.g., tidying up WIP commits), other team members need to sync properly to avoid bringing back old commits.

### The Problem

```
BEFORE REBASE -i:

shared branch:  W1 --- W2 --- W3 --- W4   (WIP commits)
                                     |
You and colleague both have this ────┘

YOU SQUASH AND FORCE PUSH:

remote:             S1   (single squashed commit)

colleague's local:  W1 --- W2 --- W3 --- W4   (still has old WIP!)
```

If colleague does `git pull` (without rebase), it creates a merge commit and **brings back the old WIP commits**.

### The Solution

**Always use rebase when pulling:**

```bash
git pull --rebase
```

Or:

```bash
git fetch origin
git rebase origin/branch-name
```

**What happens:**

```
remote:             S1

colleague before:   W1 --- W2 --- W3 --- W4 --- W5 (new work)

colleague after:    S1 --- W5'
                    ↑       ↑
              (squashed)  (only new commit, rebased on top)
```

Git recognizes W1-W4 content is already in S1, so it only replays the new commit (W5).

### Configure Git to Always Rebase on Pull

Set this globally to avoid accidents:

```bash
git config --global pull.rebase true
```

Now `git pull` automatically does `git pull --rebase`.

### Summary

| Command                              | Result                                   |
| ------------------------------------ | ---------------------------------------- |
| `git pull` (without config)          | ❌ Merge commit, brings back old commits |
| `git pull --rebase`                  | ✅ Rebases your work on top              |
| `git pull` (with `pull.rebase true`) | ✅ Same as above                         |

---

## Keeping Your Feature Branch Updated

If develop has new commits while you're working:

```bash
git fetch origin
git rebase origin/develop
```

**Do NOT use:**

```bash
git merge develop   # Creates merge commit
git pull            # May create merge commit (without rebase config)
```

---

## Summary of Rules

| Rule                                                  | Reason                                  |
| ----------------------------------------------------- | --------------------------------------- |
| Never merge, always rebase or squash                  | Keeps linear history                    |
| Never rebase shared branches (main, develop) directly | Breaks others' branches                 |
| Reset develop after each release                      | Keeps develop in sync with main         |
| Cherry-pick hotfixes to develop                       | Avoids disrupting active work           |
| Always `git pull --rebase`                            | Prevents bringing back squashed commits |
| Team rebases after develop reset                      | Updates feature branch bases            |

---

## Quick Reference

```bash
# Configure git to always rebase on pull (do this once)
git config --global pull.rebase true

# Start new branch (feat, fix, docs, refactor, chore, ci, test, perf, style, build)
git checkout develop && git pull
git checkout -b <type>/descriptive-name

# Update branch with latest develop
git fetch origin
git rebase origin/develop

# After develop is reset (post-release)
git fetch origin
git rebase origin/develop

# Sync after someone rebased/squashed a shared branch
git pull --rebase

# Cherry-pick hotfix to develop (maintainers only)
git checkout develop
git cherry-pick <commit-hash>
git push

# Rebase --onto to sync develop with main while preserving unique commits
git checkout develop
git rebase --onto origin/main <last-shared-commit> develop
git push --force-with-lease
```
