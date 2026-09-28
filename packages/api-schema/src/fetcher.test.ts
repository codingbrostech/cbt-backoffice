import { afterEach, describe, expect, it, vi } from 'vitest';

import { customFetch, getApiBaseUrl, setApiBaseUrl } from './fetcher';

function jsonResponse(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
}

function textResponse(body: string, init?: ResponseInit) {
  return new Response(body, init);
}

describe('customFetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    setApiBaseUrl('');
  });

  describe('when a base URL is set', () => {
    it('should resolve with the envelope from that base URL', async () => {
      setApiBaseUrl('https://api.example');
      const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ ok: true }));
      vi.stubGlobal('fetch', fetchMock);

      await expect(customFetch('/mgt/v1/auth/validate')).resolves.toMatchObject({
        data: { ok: true },
        status: 200
      });
      expect(fetchMock).toHaveBeenCalledWith('https://api.example/mgt/v1/auth/validate', undefined);
      expect(getApiBaseUrl()).toBe('https://api.example');
    });
  });

  describe('when no base URL is set', () => {
    it('should request the bare path', async () => {
      const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ ok: true }));
      vi.stubGlobal('fetch', fetchMock);

      await customFetch('/health');

      expect(fetchMock).toHaveBeenCalledWith('/health', undefined);
    });
  });

  describe('when the response body is not valid JSON', () => {
    it('should reject with a tagged SyntaxError', async () => {
      vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(textResponse('not json')));

      await expect(customFetch('/broken')).rejects.toThrow(
        '[api-schema] Response from /broken is not valid JSON (status 200)'
      );
    });
  });

  describe('when an HTTP error has a non-JSON body', () => {
    it('should reject with a SyntaxError tagged with the path and status', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn<typeof fetch>().mockResolvedValue(textResponse('expired token', { status: 401 }))
      );

      const request = customFetch('/mgt/v1/auth/validate');
      await expect(request).rejects.toBeInstanceOf(SyntaxError);
      await expect(request).rejects.toThrow(
        '[api-schema] Response from /mgt/v1/auth/validate is not valid JSON (status 401)'
      );
    });
  });

  describe('when an HTTP error has a JSON body', () => {
    it('should resolve with the response envelope and error status', async () => {
      vi.stubGlobal(
        'fetch',
        vi
          .fn<typeof fetch>()
          .mockResolvedValue(jsonResponse({ message: 'forbidden' }, { status: 403 }))
      );

      await expect(customFetch('/mgt/v1/auth/validate')).resolves.toMatchObject({
        data: { message: 'forbidden' },
        status: 403
      });
    });
  });
});
