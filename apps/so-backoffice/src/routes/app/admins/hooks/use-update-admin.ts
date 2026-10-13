import { ADMIN_QUERY_KEY, updateAdminMutationOptions } from '@cbt-bo/api/admin/queries';
import type { AdminUpdateInput } from '@cbt-bo/api-schema/bo/models';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface IUseUpdateAdminResult {
  /**
   * Updates the admin and refreshes the list. Resolves `true` on success
   * and `false` once the error toast has been shown.
   */
  updateAdmin: (input: AdminUpdateInput) => Promise<boolean>;
  isPending: boolean;
}

export const useUpdateAdmin = (): IUseUpdateAdminResult => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useMutation({
    ...updateAdminMutationOptions(),
    onSuccess: async () => {
      toast.success(t('admins.updated'));
      await queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEY });
    }
  });

  const updateAdmin = useCallback(
    async (input: AdminUpdateInput): Promise<boolean> => {
      try {
        await mutateAsync(input);
        return true;
      } catch {
        return false;
      }
    },
    [mutateAsync]
  );

  return { updateAdmin, isPending };
};
