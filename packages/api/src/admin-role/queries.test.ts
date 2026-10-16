import { QueryClient } from '@tanstack/react-query';

import { getAdminRoles } from '@cbt-bo/api/admin-role/actions';

import { adminRoleListQueryKey, adminRoleListQueryOptions, buildRoleNameByCode } from './queries';

vi.mock('@cbt-bo/api/admin-role/actions', () => ({
  getAdminRoles: vi.fn(),
  getAllRolePermissions: vi.fn()
}));

describe('buildRoleNameByCode', () => {
  describe('when roles carry a code and a name', () => {
    it('should map each code to its name', () => {
      const roles = [
        { code: 'admin', name: 'Admin' },
        { code: 'super', name: 'Super Admin' }
      ];

      expect(buildRoleNameByCode(roles)).toEqual({ admin: 'Admin', super: 'Super Admin' });
    });
  });

  describe('when a role lacks a code or a name', () => {
    it('should leave that role out', () => {
      const roles = [{ code: 'admin' }, { name: 'Super Admin' }, { code: 'ops', name: 'Ops' }];

      expect(buildRoleNameByCode(roles)).toEqual({ ops: 'Ops' });
    });
  });
});

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
