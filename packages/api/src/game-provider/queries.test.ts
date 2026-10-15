import { QueryClient } from '@tanstack/react-query';

import { getGameProviders } from '@cbt-bo/api/game-provider/actions';

import { gameProviderListQueryOptions } from './queries';

vi.mock('@cbt-bo/api/game-provider/actions', () => ({
  getGameProviders: vi.fn()
}));

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
