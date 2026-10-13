import { QueryClient } from '@tanstack/react-query';

import { getAdminRoles } from '@cbt-bo/api/admin-role/actions';

import { adminRoleListQueryKey, adminRoleListQueryOptions } from './queries';

vi.mock('@cbt-bo/api/admin-role/actions', () => ({
  getAdminRoles: vi.fn(),
  getAllRolePermissions: vi.fn()
}));

describe('adminRoleListQueryOptions', () => {
  afterEach(() => {
    vi.mocked(getAdminRoles).mockReset();
  });

  describe('when built', () => {
    it('should key the query on the role list', () => {
      expect(adminRoleListQueryOptions().queryKey).toEqual(['admin-role', 'list']);
      expect(adminRoleListQueryKey()).toEqual(['admin-role', 'list']);
    });
  });

  describe('when the API returns roles', () => {
    it('should request every role and resolve them', async () => {
      const roles = [{ code: 'admin', name: 'Admin' }];
      vi.mocked(getAdminRoles).mockResolvedValue({ data: roles, total: 1 });

      await expect(new QueryClient().query(adminRoleListQueryOptions())).resolves.toEqual(roles);
      expect(getAdminRoles).toHaveBeenCalledWith({ pageSize: -1 });
    });
  });

  describe('when the API omits the roles', () => {
    it('should resolve an empty list', async () => {
      vi.mocked(getAdminRoles).mockResolvedValue({});

      await expect(new QueryClient().query(adminRoleListQueryOptions())).resolves.toEqual([]);
    });
  });
});
