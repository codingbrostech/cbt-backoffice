import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  type TExportJobStatus,
  type TExportReportType,
  createExportJob,
  getExportJob
} from '~/actions/export-jobs';
import { useNotification } from '~/hooks/use-notification';

export interface IUseExportJobResult {
  isExporting: boolean;
  jobStatus?: TExportJobStatus;
  startExportJob: (reportType: TExportReportType, input: object) => Promise<void>;
}

const POLL_INTERVAL_MS = 2500;
const TIMEOUT_MS = 10 * 60 * 1000;

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const isJobRunning = (status: TExportJobStatus): boolean =>
  status === 'pending' || status === 'processing';

const buildErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

/**
 * Creates an export job, polls it on POLL_INTERVAL_MS until it finishes or
 * TIMEOUT_MS passes, then opens the download URL.
 */
export const useExportJob = (): IUseExportJobResult => {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const [isExporting, setIsExporting] = useState(false);
  const [jobStatus, setJobStatus] = useState<TExportJobStatus>();
  const exportIdRef = useRef(0);

  const startExportJob = useCallback(
    async (reportType: TExportReportType, input: object) => {
      if (isExporting) return;

      const exportId = exportIdRef.current + 1;
      exportIdRef.current = exportId;
      setIsExporting(true);
      setJobStatus(undefined);

      const isCurrent = () => exportIdRef.current === exportId;

      try {
        const created = await createExportJob({ reportType, input });
        const startedAt = Date.now();
        let status = created.status;

        setJobStatus(status);

        while (isJobRunning(status) && isCurrent()) {
          if (Date.now() - startedAt >= TIMEOUT_MS) {
            showErrorNotification({ title: t('export.exportJobTimedOut') });
            return;
          }

          await sleep(POLL_INTERVAL_MS);

          const job = await getExportJob({ id: created.jobId });
          status = job.status;
          setJobStatus(status);

          if (status === 'done') {
            if (!job.downloadUrl) {
              showErrorNotification({ title: t('export.exportJobDownloadUrlMissing') });
              return;
            }
            window.location.href = job.downloadUrl;
            return;
          }

          if (status === 'failed') {
            showErrorNotification({ title: job.errorMsg ?? t('export.exportJobFailed') });
            return;
          }
        }
      } catch (err) {
        showErrorNotification({ title: buildErrorMessage(err) });
      } finally {
        if (isCurrent()) setIsExporting(false);
      }
    },
    [isExporting, showErrorNotification, t]
  );

  useEffect(
    () => () => {
      exportIdRef.current += 1;
    },
    []
  );

  return { isExporting, jobStatus, startExportJob };
};
