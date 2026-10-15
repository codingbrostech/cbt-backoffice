import { QueryClient } from '@tanstack/react-query';

import { getGameProviders } from '@cbt-bo/api/game-provider/actions';

import { buildProviderNameByCode, gameProviderListQueryOptions } from './queries';

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
