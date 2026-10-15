import { mutationOptions } from '@tanstack/react-query';
import { sleep } from 'radash';

import {
  type TExportJobStatus,
  type TExportReportType,
  createExportJob,
  getExportJob
} from '@cbt-bo/api/export-job/actions';

/**
 * Why an export ended without a download URL.
 */
export type TExportJobFailure = 'createFailed' | 'failed' | 'downloadUrlMissing' | 'timedOut';

export interface IExportJobRequest {
  reportType: TExportReportType;
  /**
   * Filters of the report's own list endpoint, without the page.
   */
  input: object;
  /**
   * Stops the polling with an abort error once aborted.
   */
  signal?: AbortSignal;
}

export const EXPORT_JOB_QUERY_KEY = ['export-job'] as const;

export const EXPORT_JOB_POLL_INTERVAL_MS = 2_500;
export const EXPORT_JOB_TIMEOUT_MS = 10 * 60_000;

/**
 * Page key of the role permission whose create flag allows exporting.
 */
export const EXPORT_PERMISSION_PAGE_KEY = 'export-function';

const RUNNING_STATUSES = ['pending', 'processing'] as const satisfies readonly TExportJobStatus[];

/**
 * Thrown when an export job ends without a download URL. `detail` carries the
 * job's own error message when the API gives one.
 */
export class ExportJobError extends Error {
  readonly reason: TExportJobFailure;

  readonly detail?: string;

  constructor(reason: TExportJobFailure, detail?: string) {
    super(detail ?? reason);
    this.name = 'ExportJobError';
    this.reason = reason;
    this.detail = detail;
  }
}

export const exportJobMutationKey = () => [...EXPORT_JOB_QUERY_KEY, 'run'] as const;

const pollExportJob = async (
  id: string,
  deadline: number,
  signal?: AbortSignal
): Promise<string> => {
  await sleep(EXPORT_JOB_POLL_INTERVAL_MS);
  signal?.throwIfAborted();

  const { status, downloadUrl, errorMsg } = await getExportJob({ id });

  const isRunning = RUNNING_STATUSES.some(candidate => candidate === status);
  const isTimedOut = Date.now() >= deadline;

  if (status === 'done' && downloadUrl) return downloadUrl;
  if (status === 'done') throw new ExportJobError('downloadUrlMissing');
  if (!isRunning) throw new ExportJobError('failed', errorMsg);
  if (isTimedOut) throw new ExportJobError('timedOut');

  return pollExportJob(id, deadline, signal);
};

const runExportJob = async ({ reportType, input, signal }: IExportJobRequest): Promise<string> => {
  const { jobId } = await createExportJob({ reportType, input });

  if (!jobId) throw new ExportJobError('createFailed');

  return pollExportJob(jobId, Date.now() + EXPORT_JOB_TIMEOUT_MS, signal);
};

/**
 * Creates an export job through `/mgt/v1/export/job/create`, polls
 * `/mgt/v1/export/job/get` every EXPORT_JOB_POLL_INTERVAL_MS and resolves
 * with the file's download URL once the job is done. Rejects with an
 * ExportJobError when the job fails, finishes without a URL or runs past
 * EXPORT_JOB_TIMEOUT_MS.
 *
 * @example
 * const { mutate } = useMutation(exportJobMutationOptions());
 * mutate({ reportType: 'wagertxn', input: filter });
 */
export const exportJobMutationOptions = () =>
  mutationOptions({
    mutationKey: exportJobMutationKey(),
    mutationFn: (request: IExportJobRequest) => runExportJob(request)
  });
