import { buildPagePermission } from './use-page-permission';

describe('buildPagePermission', () => {
  describe('when the role has an entry for the page', () => {
    it('should map the flags', () => {
      const permission = buildPagePermission(
        [{ pageKey: 'admins', type: 'page', canCreate: true, canRead: true, canUpdate: false }],
        'admins'
      );

      expect(permission).toEqual({
        isCreateAllowed: true,
        isReadAllowed: true,
        isUpdateAllowed: false,
        isDeleteAllowed: false
      });
    });
  });

  describe('when only an action entry matches the key', () => {
    it('should deny everything', () => {
      const permission = buildPagePermission(
        [{ pageKey: 'admins', type: 'action', canCreate: true }],
        'admins'
      );

      expect(permission.isCreateAllowed).toBe(false);
      expect(permission.isReadAllowed).toBe(false);
    });
  });
});
