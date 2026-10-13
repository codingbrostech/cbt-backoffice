import { MutationObserver, QueryClient } from '@tanstack/react-query';

import { createAdmin, getAdmins, updateAdmin } from '@cbt-bo/api/admin/actions';

import {
  adminListQueryKey,
  adminListQueryOptions,
  buildAdminListParams,
  createAdminMutationOptions,
  updateAdminMutationOptions
} from './queries';

vi.mock('@cbt-bo/api/admin/actions', () => ({
  getAdmins: vi.fn(),
  createAdmin: vi.fn(),
  updateAdmin: vi.fn()
}));

const PARAMS = { page: 2, pageSize: 20, code: 'ada' };
const PAGE = { page: 1, pageSize: 10 };

describe('adminListQueryOptions', () => {
  afterEach(() => {
    vi.mocked(getAdmins).mockReset();
  });

  describe('when built for a page', () => {
    it('should key the query on the full params', () => {
      expect(adminListQueryOptions(PARAMS).queryKey).toEqual(['admin', 'list', PARAMS]);
      expect(adminListQueryKey(PARAMS)).toEqual(['admin', 'list', PARAMS]);
    });
  });

  describe('when the API returns rows and a total', () => {
    it('should pass the params through and resolve the page', async () => {
      const rows = [{ id: '1', code: 'ada' }];
      vi.mocked(getAdmins).mockResolvedValue({ data: rows, total: 41 });

      await expect(new QueryClient().query(adminListQueryOptions(PARAMS))).resolves.toEqual({
        rows,
        total: 41
      });
      expect(getAdmins).toHaveBeenCalledWith(PARAMS);
    });
  });

  describe('when the API omits the rows and the total', () => {
    it('should resolve an empty page', async () => {
      vi.mocked(getAdmins).mockResolvedValue({});

      await expect(new QueryClient().query(adminListQueryOptions(PARAMS))).resolves.toEqual({
        rows: [],
        total: 0
      });
    });
  });
});

describe('buildAdminListParams', () => {
  describe('when every filter field is blank', () => {
    it('should return the page alone', () => {
      expect(buildAdminListParams(PAGE, { code: '', state: '', role: '' })).toEqual(PAGE);
    });
  });

  describe('when some filter fields are filled', () => {
    it('should add only those to the page', () => {
      expect(buildAdminListParams(PAGE, { code: '', state: 'active', role: 'admin' })).toEqual({
        ...PAGE,
        state: 'active',
        role: 'admin'
      });
    });
  });
});

describe('buildAdminListParams with a login', () => {
  describe('when the login is filled', () => {
    it('should send it as a fuzzy match', () => {
      expect(buildAdminListParams(PAGE, { code: 'ada', state: '', role: '' })).toEqual({
        ...PAGE,
        code: 'like:ada'
      });
    });
  });
});

describe('createAdminMutationOptions', () => {
  afterEach(() => {
    vi.mocked(createAdmin).mockReset();
  });

  describe('when built', () => {
    it('should key the mutation under the admin key', () => {
      expect(createAdminMutationOptions().mutationKey).toEqual(['admin', 'create']);
    });
  });

  describe('when mutated with an input', () => {
    it('should create the admin and resolve the record', async () => {
      const input = { code: 'ada', secret: 'secret', role: 'admin' };
      const created = { id: '7', ...input };
      vi.mocked(createAdmin).mockResolvedValue(created);
      const observer = new MutationObserver(new QueryClient(), createAdminMutationOptions());

      await expect(observer.mutate(input)).resolves.toEqual(created);
      expect(createAdmin).toHaveBeenCalledWith(input);
    });
  });
});

describe('updateAdminMutationOptions', () => {
  afterEach(() => {
    vi.mocked(updateAdmin).mockReset();
  });

  describe('when built', () => {
    it('should key the mutation under the admin key', () => {
      expect(updateAdminMutationOptions().mutationKey).toEqual(['admin', 'update']);
    });
  });

  describe('when mutated with an input', () => {
    it('should update the admin and resolve the record', async () => {
      const input = { id: '7', role: 'ops' };
      const updated = { id: '7', code: 'ada', role: 'ops' };
      vi.mocked(updateAdmin).mockResolvedValue(updated);
      const observer = new MutationObserver(new QueryClient(), updateAdminMutationOptions());

      await expect(observer.mutate(input)).resolves.toEqual(updated);
      expect(updateAdmin).toHaveBeenCalledWith(input);
    });
  });
});
