import { QueryClient } from '@tanstack/react-query';

import { getGameProviders } from '@cbt-bo/api/game-provider/actions';

import {
  buildGameProviderListParams,
  buildProviderNameByCode,
  gameProviderListPageQueryOptions,
  gameProviderListQueryOptions
} from './queries';

const PAGE = { page: 1, pageSize: 10 };

vi.mock('@cbt-bo/api/game-provider/actions', () => ({
  getGameProviders: vi.fn()
}));

describe('buildProviderNameByCode', () => {
  describe('when providers carry a code and a name', () => {
    it('should map each code to its name', () => {
      const providers = [
        { code: 'bti', name: 'BTI' },
        { code: 'evo', name: 'Evolution' }
      ];

      expect(buildProviderNameByCode(providers)).toEqual({ bti: 'BTI', evo: 'Evolution' });
    });
  });

  describe('when a provider lacks a code or a name', () => {
    it('should leave that provider out', () => {
      const providers = [{ code: 'bti' }, { name: 'Evolution' }, { code: 'jl', name: 'JILI' }];

      expect(buildProviderNameByCode(providers)).toEqual({ jl: 'JILI' });
    });
  });
});

describe('gameProviderListQueryOptions', () => {
  afterEach(() => {
    vi.mocked(getGameProviders).mockReset();
  });

  describe('when the API returns providers', () => {
    it('should request every row and resolve the list', async () => {
      const providers = [{ code: 'evo', name: 'Evolution' }];
      vi.mocked(getGameProviders).mockResolvedValue({ data: providers });

      await expect(new QueryClient().query(gameProviderListQueryOptions())).resolves.toEqual(
        providers
      );
      expect(getGameProviders).toHaveBeenCalledWith({ pageSize: -1 });
    });
  });

  describe('when the API returns no data', () => {
    it('should resolve an empty list', async () => {
      vi.mocked(getGameProviders).mockResolvedValue({});

      await expect(new QueryClient().query(gameProviderListQueryOptions())).resolves.toEqual([]);
    });
  });
});

describe('buildGameProviderListParams', () => {
  describe('when every filter field is blank', () => {
    it('should return the page alone', () => {
      expect(buildGameProviderListParams(PAGE, { code: '', name: '', state: '' })).toEqual(PAGE);
    });
  });

  describe('when the state filter is filled', () => {
    it('should add it as an exact match', () => {
      expect(buildGameProviderListParams(PAGE, { code: '', name: '', state: 'active' })).toEqual({
        ...PAGE,
        state: 'active'
      });
    });
  });

  describe('when the code and name filters are filled', () => {
    it('should send both as fuzzy matches', () => {
      expect(buildGameProviderListParams(PAGE, { code: 'jl', name: 'JILI', state: '' })).toEqual({
        ...PAGE,
        code: 'like:jl',
        name: 'like:JILI'
      });
    });
  });
});

describe('gameProviderListPageQueryOptions', () => {
  afterEach(() => {
    vi.mocked(getGameProviders).mockReset();
  });

  describe('when the API returns a page', () => {
    it('should resolve its rows and total', async () => {
      const providers = [{ code: 'evo', name: 'Evolution' }];
      vi.mocked(getGameProviders).mockResolvedValue({ data: providers, total: 1 });

      await expect(
        new QueryClient().query(gameProviderListPageQueryOptions(PAGE))
      ).resolves.toEqual({ rows: providers, total: 1 });
      expect(getGameProviders).toHaveBeenCalledWith(PAGE);
    });
  });

  describe('when the API returns no data', () => {
    it('should resolve an empty page', async () => {
      vi.mocked(getGameProviders).mockResolvedValue({});

      await expect(
        new QueryClient().query(gameProviderListPageQueryOptions(PAGE))
      ).resolves.toEqual({ rows: [], total: 0 });
    });
  });
});
