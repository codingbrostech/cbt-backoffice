import { MutationObserver, QueryClient } from '@tanstack/react-query';

import { createExportJob, getExportJob } from '@cbt-bo/api/export-job/actions';

import {
  EXPORT_JOB_POLL_INTERVAL_MS,
  ExportJobError,
  type IExportJobRequest,
  exportJobMutationOptions
} from './queries';

vi.mock('@cbt-bo/api/export-job/actions', () => ({
  createExportJob: vi.fn(),
  getExportJob: vi.fn()
}));

const REQUEST = {
  reportType: 'wagertxn',
  input: { betState: 'result' }
} as const satisfies IExportJobRequest;
const DOWNLOAD_URL = 'https://files.example.com/wagertxn.xlsx';

const runExport = (request: IExportJobRequest) =>
  new MutationObserver(new QueryClient(), exportJobMutationOptions()).mutate(request);

describe('exportJobMutationOptions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(createExportJob).mockResolvedValue({ jobId: 'job-1', status: 'pending' });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.mocked(createExportJob).mockReset();
    vi.mocked(getExportJob).mockReset();
  });

  describe('when the job finishes after processing', () => {
    it('should resolve with the download URL', async () => {
      vi.mocked(getExportJob)
        .mockResolvedValueOnce({ status: 'processing' })
        .mockResolvedValueOnce({ status: 'done', downloadUrl: DOWNLOAD_URL });

      const result = runExport(REQUEST);
      await vi.runAllTimersAsync();

      await expect(result).resolves.toBe(DOWNLOAD_URL);
      expect(createExportJob).toHaveBeenCalledWith({
        reportType: 'wagertxn',
        input: { betState: 'result' }
      });
      expect(getExportJob).toHaveBeenCalledTimes(2);
      expect(getExportJob).toHaveBeenCalledWith({ id: 'job-1' });
    });

    it('should wait the poll interval before each check', async () => {
      vi.mocked(getExportJob).mockResolvedValue({ status: 'done', downloadUrl: DOWNLOAD_URL });

      const result = runExport(REQUEST);
      await vi.advanceTimersByTimeAsync(EXPORT_JOB_POLL_INTERVAL_MS - 1);

      expect(getExportJob).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(1);

      await expect(result).resolves.toBe(DOWNLOAD_URL);
    });
  });

  describe('when the job fails', () => {
    it('should reject with the job error message', async () => {
      vi.mocked(getExportJob).mockResolvedValue({ status: 'failed', errorMsg: 'too many rows' });

      const result = runExport(REQUEST);
      const assertion = expect(result).rejects.toMatchObject({
        reason: 'failed',
        detail: 'too many rows'
      });
      await vi.runAllTimersAsync();

      await assertion;
    });
  });

  describe('when the job is done without a download URL', () => {
    it('should reject with the missing URL reason', async () => {
      vi.mocked(getExportJob).mockResolvedValue({ status: 'done' });

      const result = runExport(REQUEST);
      const assertion = expect(result).rejects.toMatchObject({ reason: 'downloadUrlMissing' });
      await vi.runAllTimersAsync();

      await assertion;
    });
  });

  describe('when the job is not created', () => {
    it('should reject without polling', async () => {
      vi.mocked(createExportJob).mockResolvedValue({});

      await expect(runExport(REQUEST)).rejects.toBeInstanceOf(ExportJobError);
      expect(getExportJob).not.toHaveBeenCalled();
    });
  });

  describe('when the job keeps processing past the timeout', () => {
    it('should reject with the timed out reason', async () => {
      vi.mocked(getExportJob).mockResolvedValue({ status: 'processing' });

      const result = runExport(REQUEST);
      const assertion = expect(result).rejects.toMatchObject({ reason: 'timedOut' });
      await vi.runAllTimersAsync();

      await assertion;
    });
  });

  describe('when the signal is aborted while waiting', () => {
    it('should stop polling', async () => {
      const controller = new AbortController();

      const result = runExport({ ...REQUEST, signal: controller.signal });
      const assertion = expect(result).rejects.toThrow();
      controller.abort();
      await vi.runAllTimersAsync();

      await assertion;
      expect(getExportJob).not.toHaveBeenCalled();
    });
  });
});
