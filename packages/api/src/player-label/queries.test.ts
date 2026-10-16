import { QueryClient } from '@tanstack/react-query';

import { getPlayerLabels } from '@cbt-bo/api/player-label/actions';

import { buildLabelNameById, playerLabelListQueryOptions } from './queries';

vi.mock('@cbt-bo/api/player-label/actions', () => ({
  getPlayerLabels: vi.fn()
}));

describe('buildLabelNameById', () => {
  describe('when labels carry an ID and a name', () => {
    it('should map each ID to its name', () => {
      const labels = [
        { id: 'l1', name: 'VIP' },
        { id: 'l2', name: 'Blocked' }
      ];

      expect(buildLabelNameById(labels)).toEqual({ l1: 'VIP', l2: 'Blocked' });
    });
  });

  describe('when a label lacks an ID or a name', () => {
    it('should leave that label out', () => {
      const labels = [{ id: 'l1' }, { name: 'Blocked' }, { id: 'l3', name: 'New' }];

      expect(buildLabelNameById(labels)).toEqual({ l3: 'New' });
    });
  });
});

describe('playerLabelListQueryOptions', () => {
  afterEach(() => {
    vi.mocked(getPlayerLabels).mockReset();
  });

  describe('when the API returns labels', () => {
    it('should request every row and resolve the list', async () => {
      const labels = [{ id: 'l1', name: 'VIP' }];
      vi.mocked(getPlayerLabels).mockResolvedValue({ data: labels });

      await expect(new QueryClient().query(playerLabelListQueryOptions())).resolves.toEqual(labels);
      expect(getPlayerLabels).toHaveBeenCalledWith({ pageSize: -1 });
    });
  });

  describe('when the API returns no data', () => {
    it('should resolve an empty list', async () => {
      vi.mocked(getPlayerLabels).mockResolvedValue({});

      await expect(new QueryClient().query(playerLabelListQueryOptions())).resolves.toEqual([]);
    });
  });
});
