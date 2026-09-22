import { userSessionStore } from '~/store/user-session-store';
import { setEnv } from '~/utils/env';

import {
  ApiError,
  UNAUTHORIZED_API_CODE,
  UNAUTHORIZED_EVENT,
  createMgtAction,
  createMgtBlobAction,
  createMgtPostAction
} from './mgt';

interface IEnvelope<TResult> {
  data: TResult;
  status: number;
  headers: Headers;
}

const buildEnvelope = <TResult>(data: TResult, status = 200): IEnvelope<TResult> => ({
  data,
  status,
  headers: new Headers()
});

const jsonResponse = (data: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });

describe('createMgtAction', () => {
  beforeEach(() => {
    setEnv({
      brand: 'FM',
      mgtBaseUrl: 'https://mgt.example',
      mgtSiteId: 'site-1',
      clientSiteLocales: 'en'
    });
    userSessionStore.actions.setToken('token-1');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    userSessionStore.actions.setToken(undefined);
  });

  describe('when the service responds with 2xx', () => {
    it('should resolve with the envelope data and send the session headers', async () => {
      const service = vi.fn().mockResolvedValue(buildEnvelope({ id: 1 }));
      const action = createMgtAction(service);

      await expect(action({ q: 'x' })).resolves.toEqual({ id: 1 });
      expect(service).toHaveBeenCalledWith(
        { q: 'x' },
        { headers: { Authorization: 'Bearer token-1', 'X-Tgpx-Site': 'site-1' } }
      );
    });
  });

  describe('when no token is stored', () => {
    it('should omit the Authorization header', async () => {
      userSessionStore.actions.setToken(undefined);
      const service = vi.fn().mockResolvedValue(buildEnvelope({}));

      await createMgtAction(service)({});

      expect(service).toHaveBeenCalledWith({}, { headers: { 'X-Tgpx-Site': 'site-1' } });
    });
  });

  describe('when the service responds with 401', () => {
    it('should dispatch the unauthorized event and throw', async () => {
      const listener = vi.fn();
      window.addEventListener(UNAUTHORIZED_EVENT, listener);
      const service = vi.fn().mockResolvedValue(buildEnvelope({}, 401));

      await expect(createMgtAction(service)({})).rejects.toThrow('Unauthorized');
      expect(listener).toHaveBeenCalledTimes(1);

      window.removeEventListener(UNAUTHORIZED_EVENT, listener);
    });
  });

  describe('when the body carries the unauthorized api code', () => {
    it('should dispatch the unauthorized event and throw', async () => {
      const listener = vi.fn();
      window.addEventListener(UNAUTHORIZED_EVENT, listener);
      const service = vi
        .fn()
        .mockResolvedValue(buildEnvelope({ code: UNAUTHORIZED_API_CODE }, 400));

      await expect(createMgtAction(service)({})).rejects.toThrow('Unauthorized');
      expect(listener).toHaveBeenCalledTimes(1);

      window.removeEventListener(UNAUTHORIZED_EVENT, listener);
    });
  });

  describe('when the service responds with 401 and no token is stored', () => {
    it('should throw without dispatching the unauthorized event', async () => {
      userSessionStore.actions.setToken(undefined);
      const listener = vi.fn();
      window.addEventListener(UNAUTHORIZED_EVENT, listener);
      const service = vi.fn().mockResolvedValue(buildEnvelope({}, 401));

      await expect(createMgtAction(service)({})).rejects.toThrow('Unauthorized');
      expect(listener).not.toHaveBeenCalled();

      window.removeEventListener(UNAUTHORIZED_EVENT, listener);
    });
  });

  describe('when the service responds with another error', () => {
    it('should throw an ApiError built from the body', async () => {
      const service = vi
        .fn()
        .mockResolvedValue(buildEnvelope({ code: 42, message: 'nope', detail: 'why' }, 422));

      const request = createMgtAction(service)({});

      await expect(request).rejects.toBeInstanceOf(ApiError);
      await expect(request).rejects.toMatchObject({ code: 42, message: 'nope', detail: 'why' });
    });
  });
});

describe('createMgtPostAction', () => {
  beforeEach(() => {
    setEnv({
      brand: 'FM',
      mgtBaseUrl: 'https://mgt.example',
      mgtSiteId: 'site-1',
      clientSiteLocales: 'en'
    });
    userSessionStore.actions.setToken('token-1');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('when the endpoint responds with JSON', () => {
    it('should post the body to the base URL and resolve with the data', async () => {
      const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ jobId: 'j1' }));
      vi.stubGlobal('fetch', fetchMock);

      await expect(
        createMgtPostAction<{ jobId: string }>('/mgt/v1/export/job/create')({ reportType: 'x' })
      ).resolves.toEqual({ jobId: 'j1' });

      const [url, init] = fetchMock.mock.calls[0] ?? [];
      expect(url).toBe('https://mgt.example/mgt/v1/export/job/create');
      expect(init).toMatchObject({
        method: 'POST',
        headers: {
          Authorization: 'Bearer token-1',
          'X-Tgpx-Site': 'site-1',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reportType: 'x' })
      });
    });
  });
});

describe('createMgtBlobAction', () => {
  beforeEach(() => {
    setEnv({
      brand: 'FM',
      mgtBaseUrl: 'https://mgt.example',
      mgtSiteId: 'site-1',
      clientSiteLocales: 'en'
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('when the endpoint responds with a file', () => {
    it('should resolve with the blob and the extension from the headers', async () => {
      vi.stubGlobal(
        'fetch',
        vi
          .fn<typeof fetch>()
          .mockResolvedValue(new Response('a,b', { headers: { 'Content-Type': 'text/csv' } }))
      );

      const result = await createMgtBlobAction('/mgt/v1/wagertxn/export')({});

      expect(result.extension).toBe('csv');
      await expect(result.blob.text()).resolves.toBe('a,b');
    });
  });

  describe('when the endpoint responds with an error', () => {
    it('should throw an ApiError', async () => {
      vi.stubGlobal(
        'fetch',
        vi
          .fn<typeof fetch>()
          .mockResolvedValue(jsonResponse({ code: 7, message: 'bad' }, { status: 400 }))
      );

      await expect(createMgtBlobAction('/mgt/v1/wagertxn/export')({})).rejects.toMatchObject({
        code: 7,
        message: 'bad'
      });
    });
  });
});
