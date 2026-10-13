import { ADMIN_QUERY_KEY, createAdminMutationOptions } from '@cbt-bo/api/admin/queries';
import type { AdminCreateInput } from '@cbt-bo/api-schema/bo/models';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface IUseCreateAdminResult {
  /**
   * Creates the admin and refreshes the list. Resolves `true` on success
   * and `false` once the error toast has been shown.
   */
  createAdmin: (input: AdminCreateInput) => Promise<boolean>;
  isPending: boolean;
}

export const useCreateAdmin = (): IUseCreateAdminResult => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useMutation({
    ...createAdminMutationOptions(),
    onSuccess: async () => {
      toast.success(t('admins.created'));
      await queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEY });
    }
  });

  const createAdmin = useCallback(
    async (input: AdminCreateInput): Promise<boolean> => {
      try {
        await mutateAsync(input);
        return true;
      } catch {
        return false;
      }
    },
    [mutateAsync]
  );

  return { createAdmin, isPending };
};
