# Context7 Documentation Verification

Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service -- even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer -- your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. **Resolve the library** — call `mcp__context7__resolve-library-id` with the library name and the user's question, unless the user provides an exact library ID in `/org/project` format.
2. **Pick the best match** (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question). Use version-specific IDs when the user mentions a version.
3. **Fetch the docs** — call `mcp__context7__query-docs` with the selected library ID and the user's full question (not single words).
4. **Retry with `researchMode: true`** if you weren't satisfied with the answer. This retries with sandboxed agents that git-pull the actual source repos plus a live web search, then synthesizes a fresh answer. More costly than the default — use it as a targeted retry before giving up or answering from training data.
5. **Fall back to web search** only if Context7 doesn't have the library.
6. **Present citations before implementation** — show the source (Context7 library ID or URL) and the relevant documentation excerpt, and let the user verify before proceeding.
7. **Answer** using the fetched docs.
