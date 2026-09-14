---
name: jira
description: Create JIRA tickets in the FM project with a consistent 4-section format. Use when user says "create ticket", "jira ticket", "create issue", or wants to create/update JIRA tasks.
allowed-tools: Bash, Read, Grep, Glob, mcp__atlassian__*
---

# JIRA Ticket Skill

Create well-formatted JIRA tickets in the FM project with a consistent structure.

## Workflow

1. **Gather information** - Understand what the user wants to create or change
2. **Determine issue type** - Story, Task, Epic, or Subtask (see Issue Types below)
3. **Determine title** - Follow the Title Convention below
4. **Draft the change** - Use the Description Template for new tickets, or build a clear before/after diff for edits
5. **Show user and confirm** - Always show a preview before creating OR editing (see REQUIRED gate below)
6. **Create or update the ticket** - Use the appropriate JIRA MCP tool
7. **Verify rendering** - Re-fetch the ticket and confirm structure is intact (Jira's parser can silently mangle markdown; see Jira Markdown Gotchas)
8. **Report back** - Show the ticket key and link

---

## Issue Types

| Type         | When to use                                           |
|--------------|-------------------------------------------------------|
| **Epic**     | Large initiative spanning multiple stories/tasks      |
| **Story**    | User-facing feature or requirement                    |
| **Task**     | Internal/technical work (chore, refactor, infra, bug) |
| **Subtask**  | Domain-specific work under a Story or Task            |

---

## Title Convention

### Parent Issues (Story / Task / Epic)

Use `[Type]` prefix:

| Prefix       | Usage                    | Example                              |
|--------------|--------------------------|--------------------------------------|
| `[Feature]`  | New functionality        | `[Feature] User Authentication`      |
| `[Bug]`      | Defect fix               | `[Bug] Login Session Timeout`        |
| `[Chore]`    | Maintenance, refactoring | `[Chore] Database Migration`         |
| `[Hotfix]`   | Urgent production fix    | `[Hotfix] Payment Gateway Error`     |

### Subtasks

Use an `[App][Domain]` prefix. Add the app tag (e.g. `[BO]`) when the subtask targets a single app, and drop it when the subtask spans apps, leaving `[Domain]` alone.

| Prefix     | Usage              | Example                          |
|------------|--------------------|----------------------------------|
| `[FE]`     | Frontend / UI work | `[BO][FE] Implement Login Form`  |
| `[BE]`     | Backend / API work | `[BO][BE] Create Auth API`       |
| `[DevOps]` | Infrastructure     | `[DevOps] Setup CI Pipeline`     |

App tags match the parent convention (e.g. `BO` for backoffice). Never put a repo or workspace name like `[mf-client-v1]` in the title.

### Title Format

`[Prefix] Action Verb + Subject`

Use clear action verbs: Create, Implement, Fix, Update, Refactor, Setup, Configure, Investigate, Rebuild, Redesign

---

## Description Template

Every ticket description MUST use the 4-section structure (HLD / Acceptance Criteria / Tech E-Lab / Testing). The full template plus per-section rules (AC formatting, Tech E-Lab scope, parent-vs-subtask split) lives in `ticket-template.md` (sibling of this file). Read it when drafting a new ticket OR making substantive edits to a section's content.

---

## Jira Markdown Gotchas

Jira's markdown parser is non-standard. A few patterns silently corrupt rendered output:

- **Triple-backtick fenced code blocks inside nested bullets escape their indentation.**

    - Symptom: the closing fence is misread, and the next sibling bullet gets eaten into a stray code block.
    - Workaround: put code blocks at top-level (their own `### Subsection`), not nested inside a deep bullet. Reference them from the bullet (e.g., `Canonical shape: see **Story template** below.`).
    - Inline single-backtick code is fine inside bullets. The bug is specific to fenced blocks.

- **Backticks inside bold can confuse the parser.**

    - Prefer `**Title** (`code`)` over `**Title (`code`)**`.

- **Always re-fetch after editing.**

    - Confirm headings present, bullet hierarchy intact, no stray fenced blocks, no eaten siblings.
    - This is step 7 in the Workflow above.

---

## REQUIRED: Show User Before Creating or Editing

This gate applies to **both new tickets and edits to existing tickets**.

**For new tickets**, STOP and show this preview before creating:

```
Project: MF
Type: [Story/Task/Epic/Subtask]
Parent: [if subtask, show parent key]
Title: [full title with prefix]
Priority: [priority]
Assignee: [if specified]

Description:
[full description using the 4-section template]
```

Ask: **"Ready to create this ticket?"**

**For edits**, STOP and show before/after for the changed section(s) only (not the whole ticket):

```
Editing: MF-xxx — [section path, e.g. "Tech E-Lab > Storybook bullet"]

Before:
[exact current text]

After:
[exact proposed text]
```

Ask: **"Ready to apply this edit?"**

Only proceed after user confirms.

---

## JIRA MCP Tools Reference

All tools live in `mcp__atlassian__*` (Atlassian Rovo MCP). Common ones: `getJiraIssue`, `editJiraIssue`, `createJiraIssue`, `searchJiraIssuesUsingJql`, `lookupJiraAccountId`, `addCommentToJiraIssue`. Consult the live MCP schemas for full params.

Non-obvious gotchas:

- Every call needs `cloudId`. Pass site hostname directly: `cloudId: "codingbrostech.atlassian.net"`.
- Markdown uses `contentFormat` on writes, `responseContentFormat` on reads. Default to `"markdown"`.
- For a **subtask**, call `createJiraIssue` with `fields.parent: { key: "MF-xxx" }` and `fields.issuetype: { name: "Subtask" }`.

---

## Defaults

- **Project**: MF (unless user specifies otherwise)
- **Priority**: Medium (unless user specifies otherwise)
- **Format**: markdown
- **Issue type**: Story for features, Task for technical work
