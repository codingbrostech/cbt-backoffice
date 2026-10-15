import { QueryClient } from '@tanstack/react-query';

import { getWagerTxnSummary, getWagerTxns } from '@cbt-bo/api/wagertxn/actions';

import {
  DEFAULT_WAGER_TXN_LIST_FILTER,
  buildWagerTxnListParams,
  wagerTxnListQueryKey,
  wagerTxnListQueryOptions,
  wagerTxnSummaryQueryOptions
} from './queries';

vi.mock('@cbt-bo/api/wagertxn/actions', () => ({
  getWagerTxns: vi.fn(),
  getWagerTxnSummary: vi.fn()
}));

const PARAMS = { page: 2, pageSize: 20, betState: 'result' };

describe('wagerTxnListQueryOptions', () => {
  afterEach(() => {
    vi.mocked(getWagerTxns).mockReset();
  });

  describe('when built for a page', () => {
    it('should key the query on the full params', () => {
      expect(wagerTxnListQueryOptions(PARAMS).queryKey).toEqual(['wagertxn', 'list', PARAMS]);
      expect(wagerTxnListQueryKey(PARAMS)).toEqual(['wagertxn', 'list', PARAMS]);
    });
  });

  describe('when the API returns rows and a total', () => {
    it('should pass the params through and resolve the page', async () => {
      const rows = [{ id: '1', betAmt: '1000' }];
      vi.mocked(getWagerTxns).mockResolvedValue({ data: rows, total: 41 });

      await expect(new QueryClient().query(wagerTxnListQueryOptions(PARAMS))).resolves.toEqual({
        rows,
        total: 41
      });
      expect(getWagerTxns).toHaveBeenCalledWith(PARAMS);
    });
  });

  describe('when the API omits everything', () => {
    it('should resolve an empty page', async () => {
      vi.mocked(getWagerTxns).mockResolvedValue({});

      await expect(new QueryClient().query(wagerTxnListQueryOptions(PARAMS))).resolves.toEqual({
        rows: [],
        total: 0
      });
    });
  });
});

describe('wagerTxnSummaryQueryOptions', () => {
  afterEach(() => {
    vi.mocked(getWagerTxnSummary).mockReset();
  });

  describe('when built for a filter', () => {
    it('should key the query on the filter', () => {
      expect(wagerTxnSummaryQueryOptions({ betState: 'result' }).queryKey).toEqual([
        'wagertxn',
        'summary',
        { betState: 'result' }
      ]);
    });
  });

  describe('when the API returns the totals', () => {
    it('should pass the filter through and resolve the totals', async () => {
      const summary = { total: '30', totalBetAmt: '87900', totalWl: '-50000' };
      vi.mocked(getWagerTxnSummary).mockResolvedValue(summary);

      await expect(
        new QueryClient().query(wagerTxnSummaryQueryOptions({ betState: 'result' }))
      ).resolves.toEqual(summary);
      expect(getWagerTxnSummary).toHaveBeenCalledWith({ betState: 'result' });
    });
  });
});

describe('buildWagerTxnListParams', () => {
  describe('when every filter field is blank', () => {
    it('should send only the page', () => {
      expect(
        buildWagerTxnListParams({ page: 1, pageSize: 10 }, DEFAULT_WAGER_TXN_LIST_FILTER)
      ).toEqual({ page: 1, pageSize: 10 });
    });
  });

  describe('when some filter fields are filled', () => {
    it('should send only the filled fields', () => {
      const filter = { ...DEFAULT_WAGER_TXN_LIST_FILTER, betState: 'result', txnType: 'bet' };

      expect(buildWagerTxnListParams({ page: 1, pageSize: 10 }, filter)).toEqual({
        page: 1,
        pageSize: 10,
        betState: 'result',
        txnType: 'bet'
      });
    });
  });

  describe('when a fuzzy-matched field is filled', () => {
    it('should send it as a like match', () => {
      const filter = { ...DEFAULT_WAGER_TXN_LIST_FILTER, gameId: 'g1', extRoundId: 'r1' };

      expect(buildWagerTxnListParams({ page: 1, pageSize: 10 }, filter)).toEqual({
        page: 1,
        pageSize: 10,
        gameId: 'like:g1',
        extRoundId: 'like:r1'
      });
    });
  });
});
