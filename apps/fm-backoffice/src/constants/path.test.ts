import { PATH, buildPostLoginHref } from './path';

describe('buildPostLoginHref', () => {
  describe('when the redirect is an in-app path', () => {
    it('should return it unchanged', () => {
      expect(buildPostLoginHref('/players?page=2')).toBe('/players?page=2');
    });
  });

  describe('when the redirect is missing', () => {
    it('should fall back to the dashboard', () => {
      expect(buildPostLoginHref(undefined)).toBe(PATH.DASHBOARD);
      expect(buildPostLoginHref('')).toBe(PATH.DASHBOARD);
    });
  });

  describe('when the redirect points outside the app', () => {
    it('should fall back to the dashboard', () => {
      expect(buildPostLoginHref('//evil.example')).toBe(PATH.DASHBOARD);
      expect(buildPostLoginHref('https://evil.example')).toBe(PATH.DASHBOARD);
    });
  });
});
