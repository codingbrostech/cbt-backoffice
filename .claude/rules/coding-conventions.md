# Coding Conventions

Apply these when writing or editing code in this repo.

## File naming

Name files in kebab-case, with one exception. A `.tsx` file whose main export is a React component is named in PascalCase. Everything else (hooks, utilities, configs, tests) is kebab-case. Use the `.tsx` extension only for files that actually contain JSX.

- `use-player-balance.ts`, `query-client.ts`, `wallet-schema.ts`
- `WithdrawModal.tsx` (component)

The `flat/filename-case` config in `@cbt-bo/config/eslint` enforces this (kebab-case for `.ts`/`.js` families, kebab-case or PascalCase for `.tsx`). Every workspace must include that config once its files conform. Exported identifiers keep their usual casing (`use-player-balance.ts` exports `usePlayerBalance`), only filenames are affected.

## BDD test naming

Unit tests follow BDD naming. The top-level `describe` names the unit under test, a nested `describe('when ...')` names each scenario, and each `it('should ...')` names one assertion.

```ts
describe('formatBalance', () => {
  describe('when the amount is negative', () => {
    it('should render the value in parentheses', () => {
      // ...
    });
  });
});
```

## Boolean naming

Every boolean identifier starts with `is`. It is the only allowed boolean prefix. Do not use any other prefix (`can`, `should`, `has`, `was`, `did`, or anything else).

- `isSendable`, not `canSend`
- `isRetryAllowed`, not `shouldRetry`
- `isBalanceAvailable`, not `hasBalance`

## Derived value naming

When a function refines a value, the final value gets the plain name and the intermediate gets the short generic one. Do not stack an adjective onto the same noun for the refined result.

- Avoid: `const availableRoadmapEntry = status === EGameStatus.AVAILABLE ? roadmapEntry : undefined;`
- Instead:

```ts
const entry = designator ? roadmapEntryByTable[designator] : undefined;

const status = buildGameStatus(entry);
const roadmapEntry = status === EGameStatus.AVAILABLE ? entry : undefined;
```

When an adjective-prefixed intermediate exists only to be gated or merged once, fold the derivation into the builder rather than naming the intermediate.

- Avoid: `const gameData = baseGameData && !isPlayable ? { ...baseGameData, maintenance: true } : baseGameData;`
- Instead: `buildGameData` derives the maintenance flag itself, and the call site reads `const gameData = buildGameData(game);`

Prefixes that name a real transformation step stay fine, for example `encodedCells`, `visibleRows`, and `namedEntries`.

## Derivation helper naming

A helper that derives or assembles a value from inputs is named `buildXxx`, matching the existing pattern (`buildSectionJackpotItems`, `buildGroupedGameData`, `buildSlotsAreas`). Do not introduce `toXxx`, `makeXxx`, or `createXxx` variants for these.

- `buildJackpotName`, not `toJackpotName`

## No explanatory code comments

Do not add explanatory or narrative comments to edits (the "why", the "what this does", section headers). Let the code speak for itself through clear names. Keep comments that already exist. If something genuinely needs a note, prefer making the code self-documenting, or ask first.

- Avoid: a `// convert the raw locales into a deduped list` line above the code.
- Instead: let the variable names carry the meaning.

Exception: JSDoc comments on exported symbols (functions, types, contract fields) are welcome. Add one where it documents intent, parameters, or return shape. The ban is on inline narrative comments, not JSDoc. Module-internal helpers stay undocumented, since their names and the surrounding code carry the meaning.

Always write JSDoc as a multi-line block, never the single-line `/** text */` form:

```ts
/**
 * Seconds before resending is allowed again. Defaults to 60.
 */
resendSeconds?: number;
```

Keep JSDoc content short and true:

- One or two sentences of intent, never an implementation walkthrough.
- Describe only the documented code. No claims about callers, rendering, or libraries.
- Every key, unit, or behavior named in the doc must exist in the code.
- Name a governing constant instead of copying its value, so the doc stays correct when the value changes.
- Add an `@example` tag when correct usage is not obvious from the signature.
- No temporal or historical qualifiers such as "today", "for now", or "currently". Describe the code as it stands. When a field is conditional, state the condition instead.
  - Avoid: `Present only for game types with roadmap support (baccarat today).`
  - Instead: `Built from the game's roadmap feed entry. Absent when the game is unavailable.`

- Avoid: `/** Polls the meter every 30s and keeps the last values, so jackpot components never flicker. */`
- Instead:

```ts
/**
 * Polls the jackpot meter on JACKPOT_METER_POLL_INTERVAL_MS and writes each
 * payload into the shared data key.
 *
 * @example
 * useQuery(jackpotMeterPollQueryOptions());
 */
export const jackpotMeterPollQueryOptions = () => ...
```

## Declaration ordering

Inside any function body, declare things in this order. The rule applies everywhere, plain functions and React code alike.

1. Inputs (parameter handling, and in React code state plus other hook calls)
2. Derived static values computed from the inputs
3. Functions (helpers, and in React code `useCallback` handlers)
4. Side effects last (in React code `useEffect` and friends)

Blank lines separate the groups, not individual statements. Declarations that belong to the same group stay packed together.

```ts
const formatLocaleSummary = (raw: string, fallback: string): string => {
  const rawLocales = raw.split(',');
  const trimmedLocales = rawLocales.map(locale => locale.trim());

  const primaryLocale = trimmedLocales[0] ?? fallback;
  const secondaryLocales = trimmedLocales.slice(1);

  const formatLabel = (locale: string): string => locale.toUpperCase();

  return [primaryLocale, ...secondaryLocales].map(formatLabel).join(', ');
};
```

The same order in a React hook:

```ts
export const useCountdown = (seconds: number): IUseCountdownResult => {
  const [isEngaged, setIsEngaged] = useState(false);
  const [count, { startCountdown, resetCountdown }] = useBaseCountdown({ countStart: seconds });

  const remaining = isEngaged ? Math.max(0, count) : 0;
  const isActive = remaining > 0;

  const start = useCallback(() => {
    resetCountdown();
    startCountdown();
    setIsEngaged(true);
  }, [resetCountdown, startCountdown]);

  return { remaining, isActive, start };
};
```

Prefer returning the named derived values over inlining the expressions in the return object.

The same idea applies at module scope, with types leading:

1. Type and interface declarations
2. Constants, base values then values derived from them
3. Functions
4. Values computed through those functions (often the exported result), with the default export last when one exists

```ts
import { keys } from 'radash';

export type TBrand = 'FM' | 'SO';

const portalNames = {
  FM: 'FUNaloMAX Admin Portal',
  SO: 'Solaire Online Admin Portal'
} as const satisfies Record<TBrand, string>;

export const BRANDS = keys(portalNames);

export const isKnownBrand = (value?: string): value is TBrand =>
  Boolean(value && BRANDS.includes(value));

export const BRAND = isKnownBrand(process.env.BRAND) ? process.env.BRAND : undefined;
export const PORTAL_NAME = BRAND && portalNames[BRAND];
```

## Typed literal maps with `as const satisfies`

When a literal object or tuple must conform to a declared type, use `as const satisfies <Type>` rather than a type annotation. The annotation widens every value to the declared type, while `satisfies` checks the shape and keeps literal inference for lookups.

- Avoid: `const portalNames: Record<TBrand, string> = { ... }`
- Instead: `const portalNames = { ... } as const satisfies Record<TBrand, string>`

The same applies to literal arrays conforming to a declared element type.

- Avoid: `const EFFECTIVE_KICK_STATUSES: readonly MutationStatus[] = ['pending', 'success']`
- Instead: `const EFFECTIVE_KICK_STATUSES = ['pending', 'success'] as const satisfies readonly MutationStatus[]`

Check membership against such a tuple with `.some`, not `.includes`. On an `as const` tuple, `.includes` only accepts the tuple's own literal types, so passing a value of the wider union fails to compile. An equality comparison has no such constraint.

- Avoid: `EFFECTIVE_KICK_STATUSES.includes(status)`
- Instead: `EFFECTIVE_KICK_STATUSES.some(candidate => candidate === status)`

Exception: a lookup map indexed by a dynamic key (a parsed string, or a union wider than the map's keys) keeps a widened type annotation plus a plain `as const`. With `satisfies`, the object's type keeps only its literal keys, so indexing with a dynamic key no longer compiles. The annotation gives the lookup the wanted `| undefined` result under `noUncheckedIndexedAccess`.

```ts
const BET_LIMITS_BY_DESIGNATOR: Readonly<Record<string, IBetLimits>> = {
  S1: { min: 1_000, max: STANDARD_MAX_BET }
} as const;
```

A complete record indexed by exactly its own key union still uses `as const satisfies`, for example `as const satisfies Record<EGameType, ICasinoCardGameData>` looked up with an `EGameType` value.

## Prefer destructuring

Pick values out of objects and arrays with destructuring, including default values, rather than repeated property access or index access.

- Avoid: `const gameName = game.properties?.gameName ?? '';`
- Instead: `const { gameName = '' } = game.properties ?? {};`

- Avoid: `const designator = designatorMatch?.[1];`
- Instead: `const [, designator] = designatorMatch ?? [];`

- Avoid: `const { data: accounts } = useQuery(...);` then `accounts ?? []` at each use site
- Instead: `const { data: accounts = [] } = useQuery(...);`

Three boundaries apply:

- Match an existing sibling first. When a module mirrors an existing one (a new BFF route shaped like `game/home`), keep the sibling's signatures and access style, and use destructuring in code that has no sibling pattern.
- A destructuring default must be assignable to the property's declared type. TypeScript rejects `const { gameType = null } = input` when `gameType` is `string | undefined`, so use `input.gameType ?? null` at the use site in that case.
- A shared `EMPTY_X` constant, rather than an inline `= []` or `= {}`, is warranted only where identity is observed: a dependency array, a memo input, or a memoized child. `const { data: accounts = EMPTY_ACCOUNTS } = useQuery(...)` earns it because `accounts` feeds four dependency arrays. Everywhere else the inline literal behaves identically and reads shorter.

## Prefer radash helpers

radash is a dependency in nearly every workspace. Reach for its helpers before hand-rolling a utility or chaining verbose built-ins.

- Avoid: `const uniqueLocales = [...new Set(locales.filter(Boolean))];`
- Instead: `const uniqueLocales = unique(sift(locales));`

## Call shared utilities directly

When a shared utility already covers a need through its options, call it directly at the use site. Do not add a thin wrapper, a re-export, or a one-line conversion helper around it.

- Avoid: a `toMajorUnits` helper that divides by 100 before the value reaches `formatAmount`
- Instead: `formatAmount(value, { fromMinorUnits: true, decimals: 2, decimalsPad: true })`

A wrapper earns its place only when it encodes a real decision every call site must share, not when it renames an existing option.

## One operation per statement

Split a multi-step transformation into one named const per step. Do not nest or chain the calls into a single expression. The names carry the explanation, which is why no comment is needed.

- Avoid: `const envLocales = unique(sift(raw.split(',').map(normalize)));`
- Instead:

```ts
const rawLocales = raw.split(',');
const normalizedLocales = rawLocales.map(normalize);
const filledLocales = sift(normalizedLocales);
const envLocales = unique(filledLocales);
```

## Positive conditions

When testing whether a value is present, use the positive truthy form rather than a negated comparison. Negated comparisons are harder to scan and usually over-specify the check.

- Avoid: `...(gameType !== null && { gameType })`
- Instead: `...(gameType && { gameType })`

Guard clauses that early-return on the absent case (`if (!firstGame) return ...`) stay fine. The rule targets presence checks written as negated comparisons, not negation in general. When falsy values like `0` or `''` are meaningful and must pass the check, a specific comparison is still correct, and worth a JSDoc note if non-obvious.

## No silent data fallbacks

When a value derived from data matches nothing known, keep it absent (`undefined`) and let the consumer render an explicit fallback state. Substituting a plausible default misrepresents the data and hides backend changes.

- Avoid: `return matchedGameType ?? EGameType.BACCARAT;`
- Instead: `return matchedGameType;` with the consumer rendering an explicit "Others" state for games without a type.

Presentation-side defaults are fine (a placeholder image, a generic section title). The ban is on the data layer inventing a value that looks real.
