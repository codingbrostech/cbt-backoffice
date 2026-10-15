import { QueryClient } from '@tanstack/react-query';

import { getGameTypes, getGames } from '@cbt-bo/api/game/actions';

import { gameTypeListQueryOptions, openGameListQueryOptions } from './queries';

vi.mock('@cbt-bo/api/game/actions', () => ({
  getGameTypes: vi.fn(),
  getGames: vi.fn()
}));

describe('gameTypeListQueryOptions', () => {
  afterEach(() => {
    vi.mocked(getGameTypes).mockReset();
  });

  describe('when the API returns game types', () => {
    it('should resolve the list', async () => {
      vi.mocked(getGameTypes).mockResolvedValue({ data: ['slot', 'casino'] });

      await expect(new QueryClient().query(gameTypeListQueryOptions())).resolves.toEqual([
        'slot',
        'casino'
      ]);
    });
  });

  describe('when the API returns no data', () => {
    it('should resolve an empty list', async () => {
      vi.mocked(getGameTypes).mockResolvedValue({});

      await expect(new QueryClient().query(gameTypeListQueryOptions())).resolves.toEqual([]);
    });
  });
});

describe('openGameListQueryOptions', () => {
  afterEach(() => {
    vi.mocked(getGames).mockReset();
  });

  describe('when the API returns open and closed games', () => {
    it('should request every row and keep only the open, active games', async () => {
      const openGame = { id: 'g1', isOpen: true, state: 'active' };
      vi.mocked(getGames).mockResolvedValue({
        data: [
          openGame,
          { id: 'g2', isOpen: false, state: 'active' },
          { id: 'g3', isOpen: true, state: 'inactive' }
        ]
      });

      await expect(new QueryClient().query(openGameListQueryOptions())).resolves.toEqual([
        openGame
      ]);
      expect(getGames).toHaveBeenCalledWith({ page: 1, pageSize: -1 });
    });
  });

  describe('when the API returns no data', () => {
    it('should resolve an empty list', async () => {
      vi.mocked(getGames).mockResolvedValue({});

      await expect(new QueryClient().query(openGameListQueryOptions())).resolves.toEqual([]);
    });
  });
});
