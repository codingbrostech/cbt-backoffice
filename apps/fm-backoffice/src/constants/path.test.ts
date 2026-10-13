import { LOGIN_REDIRECT_PARAM, PATH, buildLoginHref, buildPostLoginHref } from './path';

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

describe('buildLoginHref', () => {
  describe('when given the current href', () => {
    it('should encode it under the redirect param', () => {
      expect(buildLoginHref('/players/players?page=2')).toBe(
        `${PATH.LOGIN}?${LOGIN_REDIRECT_PARAM}=%2Fplayers%2Fplayers%3Fpage%3D2`
      );
    });

    it('should round-trip through buildPostLoginHref', () => {
      const href = buildLoginHref('/players/players?page=2');
      const { searchParams } = new URL(href, 'http://localhost');
      const redirect = searchParams.get(LOGIN_REDIRECT_PARAM) ?? undefined;

      expect(buildPostLoginHref(redirect)).toBe('/players/players?page=2');
    });
  });
});
