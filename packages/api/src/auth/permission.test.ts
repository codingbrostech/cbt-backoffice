import { buildPermission } from './permission';

const PERMISSIONS = [
  { pageKey: 'admins', canRead: true, canCreate: true, canUpdate: false, type: 'page' },
  { pageKey: 'roles', canRead: true, canDelete: true, type: 'page' }
];

describe('buildPermission', () => {
  describe('when an entry matches the page key', () => {
    it('should map its flags', () => {
      expect(buildPermission(PERMISSIONS, 'admins')).toEqual({
        isReadAllowed: true,
        isCreateAllowed: true,
        isUpdateAllowed: false,
        isDeleteAllowed: false
      });
    });

    it('should treat a missing flag as denied', () => {
      expect(buildPermission(PERMISSIONS, 'roles')).toEqual({
        isReadAllowed: true,
        isCreateAllowed: false,
        isUpdateAllowed: false,
        isDeleteAllowed: true
      });
    });
  });

  describe('when no entry matches the page key', () => {
    it('should deny everything', () => {
      expect(buildPermission(PERMISSIONS, 'players')).toEqual({
        isReadAllowed: false,
        isCreateAllowed: false,
        isUpdateAllowed: false,
        isDeleteAllowed: false
      });
    });
  });

  describe('when the page key is absent', () => {
    it('should deny everything', () => {
      expect(buildPermission(PERMISSIONS).isReadAllowed).toBe(false);
    });
  });
});
