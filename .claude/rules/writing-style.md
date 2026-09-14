# Writing & Documentation Style

Apply this style to every piece of written output: chat responses, Jira ticket descriptions, plan files, commit messages, PR descriptions, READMEs, and any other documentation.

## Avoid em-dashes and semicolons in prose

Do not use em-dashes (—), hyphens, or semicolons (;) as prose punctuation. They make text feel staccato, dense, and hard to scan, and they hide structure that should be visible as sub-bullets.

- For a single thought, rewrite as a normal sentence. Example: "Storybook 7+ — current major" becomes "Storybook 7+, the current major".
- For multiple related facets (2+ points), use a parent line plus sub-bullets. Do not stitch ideas together with em-dashes or semicolons.
- If a bullet's body uses em-dashes or semicolons to chain ideas, split it into sub-bullets.

Hyphens in compound words (`PascalCase`, `kebab-case`, `data-pressed`) are unaffected. The rule is about prose punctuation, not lexical hyphens. The `TL;DR` token is fine because the semicolon is part of the abbreviation, not a clause-joiner.

## Avoid clause-joining colons

A colon that chains two clauses in prose is the same problem as an em-dash or semicolon. Rewrite it as separate sentences.

- Banned: "Fixes a flake in the bundler: it briefly writes a half-finished file."
- Rewrite: "Fixes a flake in the bundler. It briefly writes a half-finished file."

Colons that are not clause-joiners stay fine: a colon inside a code span like `cache: false`, and a colon introducing a list. A "/" as a word joiner (e.g. "the deposit/withdraw flow") is also fine and not covered by this rule.

## Cite external sources with blockquotes

When a claim leans on external documentation (a library reference, a web standard, an authoritative source like MDN), back it with a verbatim quotation rendered as a Markdown blockquote. The `>` block renders with a vertical bar that visually separates the citation from the surrounding text.

Pattern:

````markdown
Description sentence that makes the claim.

> *"Direct quote from the documentation."*
>
> Source: [Library docs, file.mdx](https://github.com/org/library/blob/main/path/to/doc.mdx)
````

When the blockquote sits inside a list item, indent it so the renderer keeps it in the bullet.

Principles:

- **Try to include a verbatim quote.** If you can't find one that directly supports the claim, a bare `Source: ...` line is fine. Don't paraphrase or stretch a quote to fit.
- **Match the quote to the claim.** If the claim is vendor-neutral, do not cite a vendor-specific source just because it superficially supports the point. Find a neutral source, or rewrite the claim.
- **Quote verbatim.** When you do quote, copy the source exactly. Don't trim mid-sentence to make a source fit a narrative.

Make the source line a clickable link to the actual doc page where possible. Use Markdown link syntax with short descriptive text, e.g. `[Next.js docs, robots.mdx](https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.mdx)`. For sources without a public URL, fall back to plain text.

## Explain mechanisms with concrete examples

When explaining a defect, an algorithm, or a data flow, lead with a concrete example. Show a real input, the step where the behavior diverges, and the resulting output. State the abstract rule after the example rather than instead of it.

- Avoid: "The tail turns early when the cell below is already occupied."
- Instead: name the occupying value, show the grid before and after, then state the rule.

For grid, layout, or sequencing logic, draw the state as a small text diagram so the reader can see the change rather than reconstruct it.
