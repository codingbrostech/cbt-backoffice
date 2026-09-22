import { type QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useNotification } from '~/hooks/use-notification';
import { ApiError, formatApiErrorMessage } from '~/services/mgt';

export interface IUseSaveMutationOptions<TInput, TResult> {
  mutationFn: (input: TInput) => Promise<TResult>;
  /**
   * Query keys invalidated after a successful save.
   */
  invalidateKeys: QueryKey[];
  /**
   * i18n key of the success toast, per input.
   */
  successKey: string | ((input: TInput) => string);
  /**
   * i18n key of the error toast title, per input.
   */
  failKey: string | ((input: TInput) => string);
  onSuccess?: (result: TResult, input: TInput) => void;
}

export interface IUseSaveMutationResult<TInput> {
  /**
   * Runs the mutation. Resolves to true on success, false on error, after
   * the toast has been shown.
   */
  save: (input: TInput) => Promise<boolean>;
  isPending: boolean;
}

export const buildErrorMessage = (err: unknown): string => {
  if (err instanceof ApiError) return formatApiErrorMessage(err);

  return err instanceof Error ? err.message : String(err);
};

const resolveKey = <TInput>(key: string | ((input: TInput) => string), input: TInput): string =>
  typeof key === 'function' ? key(input) : key;

/**
 * Mutation with the portal's toast and cache invalidation conventions.
 *
 * @example
 * const { save } = useSaveMutation({
 *   mutationFn: upsertAdminRole,
 *   invalidateKeys: [[ROLES_QUERY_KEY]],
 *   successKey: 'roles.message.edit.success',
 *   failKey: 'roles.message.edit.fail'
 * });
 */
export const useSaveMutation = <TInput, TResult>({
  mutationFn,
  invalidateKeys,
  successKey,
  failKey,
  onSuccess
}: IUseSaveMutationOptions<TInput, TResult>): IUseSaveMutationResult<TInput> => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showNotification, showErrorNotification } = useNotification();

  const { mutateAsync, isPending } = useMutation({
    mutationFn,
    onSuccess: async (result, input) => {
      showNotification({ title: t(resolveKey(successKey, input)) });
      onSuccess?.(result, input);
      await Promise.all(
        invalidateKeys.map(queryKey => queryClient.invalidateQueries({ queryKey }))
      );
    },
    onError: (err, input) => {
      showErrorNotification({
        title: t(resolveKey(failKey, input)),
        message: buildErrorMessage(err)
      });
    }
  });

  const save = useCallback(
    async (input: TInput) => {
      try {
        await mutateAsync(input);

        return true;
      } catch {
        return false;
      }
    },
    [mutateAsync]
  );

  return { save, isPending };
};
