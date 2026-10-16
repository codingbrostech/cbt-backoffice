import { QueryClient } from '@tanstack/react-query';

import { getPlayers } from '@cbt-bo/api/player/actions';

import {
  DEFAULT_PLAYER_LIST_FILTER,
  buildPlayerListParams,
  playerListQueryKey,
  playerListQueryOptions
} from './queries';

vi.mock('@cbt-bo/api/player/actions', () => ({
  getPlayers: vi.fn(),
  updatePlayer: vi.fn()
}));

const PARAMS = { page: 2, pageSize: 20, state: 'active' };

describe('playerListQueryOptions', () => {
  afterEach(() => {
    vi.mocked(getPlayers).mockReset();
  });

  describe('when built for a page', () => {
    it('should key the query on the full params', () => {
      expect(playerListQueryOptions(PARAMS).queryKey).toEqual(['player', 'list', PARAMS]);
      expect(playerListQueryKey(PARAMS)).toEqual(['player', 'list', PARAMS]);
    });
  });

  describe('when the API returns rows and a total', () => {
    it('should pass the params through and resolve the page', async () => {
      const rows = [{ id: 'p1', playerCode: 'ada' }];
      vi.mocked(getPlayers).mockResolvedValue({ data: rows, total: 41 });

      await expect(new QueryClient().query(playerListQueryOptions(PARAMS))).resolves.toEqual({
        rows,
        total: 41
      });
      expect(getPlayers).toHaveBeenCalledWith(PARAMS);
    });
  });

  describe('when the API omits everything', () => {
    it('should resolve an empty page', async () => {
      vi.mocked(getPlayers).mockResolvedValue({});

      await expect(new QueryClient().query(playerListQueryOptions(PARAMS))).resolves.toEqual({
        rows: [],
        total: 0
      });
    });
  });
});

describe('buildPlayerListParams', () => {
  describe('when every filter field is blank', () => {
    it('should send only the page', () => {
      expect(buildPlayerListParams({ page: 1, pageSize: 10 }, DEFAULT_PLAYER_LIST_FILTER)).toEqual({
        page: 1,
        pageSize: 10
      });
    });
  });

  describe('when some filter fields are filled', () => {
    it('should send only the filled fields', () => {
      const filter = { ...DEFAULT_PLAYER_LIST_FILTER, email: 'ada@example.com', state: 'active' };

      expect(buildPlayerListParams({ page: 1, pageSize: 10 }, filter)).toEqual({
        page: 1,
        pageSize: 10,
        email: 'ada@example.com',
        state: 'active'
      });
    });
  });

  describe('when the player ID and labels are filled', () => {
    it('should send the ID as id and the labels as labelIds', () => {
      const filter = { ...DEFAULT_PLAYER_LIST_FILTER, playerId: 'p1', labelIds: ['l1', 'l2'] };

      expect(buildPlayerListParams({ page: 1, pageSize: 10 }, filter)).toEqual({
        page: 1,
        pageSize: 10,
        id: 'p1',
        labelIds: ['l1', 'l2']
      });
    });
  });
});
