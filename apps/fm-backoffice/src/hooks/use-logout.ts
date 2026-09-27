import { signOut } from '@cbt-bo/api/auth/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { PATH } from '#/constants/path';

export interface IUseLogoutResult {
  logout: () => void;
  isPending: boolean;
}

/**
 * Signs out, returns to the login page and drops every cached query.
 */
export const useLogout = (): IUseLogoutResult => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: signOut,
    onSuccess: async () => {
      await navigate({ to: PATH.LOGIN, replace: true });
      queryClient.clear();
    }
  });

  return { logout, isPending };
};
