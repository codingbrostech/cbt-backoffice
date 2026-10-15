import { QueryClient } from '@tanstack/react-query';

import { getGameRanking } from '@cbt-bo/api/game-ranking/actions';
import type { IGameRankingEntry } from '@cbt-bo/api/game-ranking/queries';

import {
  buildGameRankingEntries,
  buildGameRankingMutateItems,
  gameRankingListQueryKey,
  gameRankingListQueryOptions
} from './queries';

vi.mock('@cbt-bo/api/game-ranking/actions', () => ({
  getGameRanking: vi.fn(),
  mutateGameRanking: vi.fn()
}));

describe('buildGameRankingEntries', () => {
  describe('when a row carries a game id', () => {
    it('should keep the texts and the game, and drop the rank', () => {
      const game = { id: 'g1', code: 'BAC01' };
      const rows = [{ rank: 1, gameId: 'g1', titles: { en: 'Top' }, descriptions: {}, game }];

      expect(buildGameRankingEntries(rows)).toEqual([
        { gameId: 'g1', titles: { en: 'Top' }, descriptions: {}, game }
      ]);
    });
  });

  describe('when a row has no game id', () => {
    it('should leave the row out', () => {
      expect(buildGameRankingEntries([{ rank: 1 }, { rank: 2, gameId: 'g2' }])).toEqual([
        { gameId: 'g2', titles: {}, descriptions: {}, game: undefined }
      ]);
    });
  });

  describe('when a row omits its texts', () => {
    it('should default them to empty maps', () => {
      expect(buildGameRankingEntries([{ gameId: 'g1' }])).toEqual([
        { gameId: 'g1', titles: {}, descriptions: {}, game: undefined }
      ]);
    });
  });
});

describe('buildGameRankingMutateItems', () => {
  describe('when entries are given in rank order', () => {
    it('should keep that order and send only the writable fields', () => {
      const entries: IGameRankingEntry[] = [
        { gameId: 'g2', titles: { en: 'Second' }, descriptions: {}, game: { id: 'g2' } },
        { gameId: 'g1', titles: {}, descriptions: { en: 'First' } }
      ];

      expect(buildGameRankingMutateItems(entries)).toEqual([
        { gameId: 'g2', titles: { en: 'Second' }, descriptions: {} },
        { gameId: 'g1', titles: {}, descriptions: { en: 'First' } }
      ]);
    });
  });
});

describe('gameRankingListQueryOptions', () => {
  afterEach(() => {
    vi.mocked(getGameRanking).mockReset();
  });

  describe('when built', () => {
    it('should key the query on the list', () => {
      expect(gameRankingListQueryOptions().queryKey).toEqual(['game-ranking', 'list']);
      expect(gameRankingListQueryKey()).toEqual(['game-ranking', 'list']);
    });
  });

  describe('when the API returns ranked rows', () => {
    it('should resolve the entries in the returned order', async () => {
      vi.mocked(getGameRanking).mockResolvedValue({
        data: [
          { rank: 1, gameId: 'g1' },
          { rank: 2, gameId: 'g2' }
        ],
        total: 2
      });

      await expect(new QueryClient().query(gameRankingListQueryOptions())).resolves.toEqual([
        { gameId: 'g1', titles: {}, descriptions: {}, game: undefined },
        { gameId: 'g2', titles: {}, descriptions: {}, game: undefined }
      ]);
      expect(getGameRanking).toHaveBeenCalledWith({});
    });
  });
});
