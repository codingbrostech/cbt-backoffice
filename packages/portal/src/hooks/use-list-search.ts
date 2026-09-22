import { useNavigate, useSearch } from '@tanstack/react-router';
import { isObject, omit } from 'radash';
import { useCallback, useMemo } from 'react';
import type { z } from 'zod';

export interface IUseListSearchResult<TOutput, TInput> {
  search: TOutput;
  setSearch: (next: TInput) => void;
}

const isRecord = (value: unknown): value is Record<string, unknown> => isObject(value);

/**
 * Parses the raw route search through `schema`, dropping the params it
 * rejects instead of throwing, so a hand-edited or stale URL falls back to
 * the schema defaults for those keys.
 */
export const parseListSearch = <TOutput extends object, TInput extends object>(
  schema: z.ZodType<TOutput, TInput>,
  rawSearch: unknown
): TOutput => {
  const result = schema.safeParse(rawSearch);
  if (result.success) return result.data;

  const rejectedKeys = result.error.issues
    .map(issue => issue.path[0])
    .filter((key): key is string => typeof key === 'string');
  const acceptedSearch = isRecord(rawSearch) ? omit(rawSearch, rejectedKeys) : {};
  const retried = schema.safeParse(acceptedSearch);

  return retried.success ? retried.data : schema.parse({});
};

/**
 * Typed search params of the current route, parsed through `schema` so
 * defaults apply, plus a setter that navigates to the same route with the
 * next params.
 *
 * @example
 * const { search, setSearch } = useListSearch(adminsSearchSchema);
 * setSearch({ ...search, page: 2 });
 */
export const useListSearch = <TOutput extends object, TInput extends object>(
  schema: z.ZodType<TOutput, TInput>
): IUseListSearchResult<TOutput, TInput> => {
  const rawSearch: unknown = useSearch({ strict: false });
  const navigate = useNavigate();

  const search = useMemo(() => parseListSearch(schema, rawSearch), [rawSearch, schema]);

  const setSearch = useCallback(
    (next: TInput) => {
      void navigate({ to: '.', search: next });
    },
    [navigate]
  );

  return { search, setSearch };
};
