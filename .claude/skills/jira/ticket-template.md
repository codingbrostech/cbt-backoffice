# Jira Ticket Template

Every FM ticket description uses these four sections in order. Each section below shows its snippet, then the guidance for filling it in.

## High Level Description

```markdown
## High Level Description

[Brief overview of what this ticket is about and why it was created.]
```

Keep it to the purpose, just enough for anyone to understand what the ticket is for and why it exists.

## Acceptance Criteria

```markdown
## Acceptance Criteria

- When [condition], user should be able to [expected outcome]
- When [condition], user should be able to [expected outcome]
```

Carry only values QA can meaningfully pass or fail on, for example copy strings and colour hex where no design token exists. Drop designer-tuning values like exact rem sizes, since "is it 1.875rem or 1.85rem" is not a real QA axis. Use relative phrasing instead when a contract is still needed (e.g. "footer larger than header").

## Tech E-Lab

```markdown
## Tech E-Lab

[Ticket-specific implementation direction.]
```

The guiding principle: use concise words only for what genuinely needs explaining, and let concise code speak for everything else. Words earn their place when they carry the why, a load-bearing decision, or a gotcha a fresh dev cannot guess. Anything a short snippet can show should be a snippet, not a paragraph.

Everything below falls out of that principle:

- Do not restate values that already live in Acceptance Criteria. Prefer a design token (e.g. the brand-red token) over a hex literal when one exists.
- Do not narrate the PR diff file-by-file. A bullet that just says "X file was modified" is noise.
- Describe the resulting shape, not the removed one. Do not reference a component, prop, or variant that the change deletes. The "why we moved off the old shape" reasoning belongs in the PR, not the ticket.
- One fenced code block per concern, with a short lead-in line. Do not bundle unrelated snippets in one fence. Show an import when a symbol's origin is not obvious.

Example. Instead of a paragraph describing a helper, show it:

`backendInit()` is server-only, injects auth and forwarding headers.

```ts
const init = backendInit();
const res = await getWalletBalance(params, init);
```

Parent tickets orient (what, why, load-bearing decisions, an end-to-end example) and hold canonical shapes once. Subtasks reference the parent and show only their page-specific snippet, one subtask per page route. Cite source changes by PR link, never by branch name, since branches are deleted after squash merge.

## Testing

```markdown
## Testing

[Test plan outlining what needs to be verified.]

- Key scenarios to test
- Edge cases to consider
- Environment / platform / data setup if applicable
```
