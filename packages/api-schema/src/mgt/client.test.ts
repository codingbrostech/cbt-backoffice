import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, UNAUTHORIZED_API_CODE } from './api-error';
import {
  type IMgtEnvelope,
  SITE_HEADER,
  type TMgtService,
  configureMgtClient,
  createMgtAction,
  resetSessionExpiredFlag
} from './client';

const buildEnvelope = <TResult>(data: TResult, status = 200): IMgtEnvelope<TResult> => ({
  data,
  status,
  headers: new Headers()
});

describe('createMgtAction', () => {
  const onUnauthorized = vi.fn();
  let token: string | undefined;

  beforeEach(() => {
    token = 'token-1';
    onUnauthorized.mockReset();
    resetSessionExpiredFlag();
    configureMgtClient({ getAuthToken: () => token, getSiteId: () => 'site-1', onUnauthorized });
  });

  describe('when the service responds with 2xx', () => {
    it('should resolve with the envelope data and send the session headers', async () => {
      const service = vi.fn().mockResolvedValue(buildEnvelope({ id: 1 }));
      const action = createMgtAction(service);

      await expect(action({ q: 'x' })).resolves.toEqual({ id: 1 });
      expect(service).toHaveBeenCalledWith(
        { q: 'x' },
        { headers: { Authorization: 'Bearer token-1', [SITE_HEADER]: 'site-1' } }
      );
    });
  });

  describe('when no token is available', () => {
    it('should omit the Authorization header', async () => {
      token = undefined;
      const service = vi.fn().mockResolvedValue(buildEnvelope({}));

      await createMgtAction(service)({});

      expect(service).toHaveBeenCalledWith({}, { headers: { [SITE_HEADER]: 'site-1' } });
    });
  });

  describe('when the service responds with 401', () => {
    it('should report the expired session once with the service name and throw', async () => {
      const respond = vi
        .fn<TMgtService<object, unknown>>()
        .mockResolvedValue(buildEnvelope({}, 401));
      const mgtServiceAuthValidate: TMgtService<object, unknown> = input => respond(input);
      const action = createMgtAction(mgtServiceAuthValidate);

      await expect(action({})).rejects.toBeInstanceOf(ApiError);
      await expect(action({})).rejects.toMatchObject({ status: 401 });

      expect(onUnauthorized).toHaveBeenCalledTimes(1);
      expect(onUnauthorized).toHaveBeenCalledWith({
        apiUrl: 'mgtServiceAuthValidate',
        status: 401
      });
    });

    it('should report again after the flag is reset', async () => {
      const service = vi.fn().mockResolvedValue(buildEnvelope({}, 401));
      const action = createMgtAction(service);

      await expect(action({})).rejects.toBeInstanceOf(ApiError);
      resetSessionExpiredFlag();
      await expect(action({})).rejects.toBeInstanceOf(ApiError);

      expect(onUnauthorized).toHaveBeenCalledTimes(2);
    });
  });

  describe('when the body carries the unauthorized api code', () => {
    it('should report the expired session and throw', async () => {
      const service = vi
        .fn()
        .mockResolvedValue(buildEnvelope({ code: UNAUTHORIZED_API_CODE }, 400));

      await expect(createMgtAction(service)({})).rejects.toMatchObject({
        code: UNAUTHORIZED_API_CODE
      });

      expect(onUnauthorized).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the service responds with 401 and no token was sent', () => {
    it('should throw without reporting the expired session', async () => {
      token = undefined;
      const service = vi.fn().mockResolvedValue(buildEnvelope({}, 401));

      await expect(createMgtAction(service)({})).rejects.toBeInstanceOf(ApiError);

      expect(onUnauthorized).not.toHaveBeenCalled();
    });
  });

  describe('when the service responds with another error', () => {
    it('should reject with an ApiError carrying the body fields', async () => {
      const service = vi
        .fn()
        .mockResolvedValue(buildEnvelope({ code: 42, message: 'nope', detail: 'why' }, 422));

      const request = createMgtAction(service)({});

      await expect(request).rejects.toBeInstanceOf(ApiError);
      await expect(request).rejects.toMatchObject({ code: 42, message: 'nope', detail: 'why' });
      expect(onUnauthorized).not.toHaveBeenCalled();
    });
  });

  describe('when the client was never configured', () => {
    it('should throw a tagged error', async () => {
      vi.resetModules();
      const { createMgtAction: createFreshAction } = await import('./client');
      const service = vi.fn().mockResolvedValue(buildEnvelope({}));

      await expect(createFreshAction(service)({})).rejects.toThrow(
        '[api-schema] configureMgtClient must be called before the MGT API is used'
      );
    });
  });
});
