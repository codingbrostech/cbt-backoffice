import type { TExportReportType } from '@cbt-bo/api/export-job/actions';
import { ExportJobError, exportJobMutationOptions } from '@cbt-bo/api/export-job/queries';
import { useMutation } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { buildErrorMessage } from '#/utils/error';

export interface IUseExportJobResult {
  /**
   * Exports `reportType` filtered by `input` and opens the file once ready.
   */
  startExport: (reportType: TExportReportType, input: object) => void;
  isExporting: boolean;
}

const buildExportErrorMessage = (error: unknown, t: TFunction): string => {
  if (error instanceof ExportJobError) {
    return error.detail ?? t(`common.exportError.${error.reason}`);
  }

  return buildErrorMessage(error);
};

/**
 * Runs an export job and opens its download URL when the file is ready.
 * Failures show as a toast. Leaving the page stops the polling and drops the
 * download.
 *
 * @example
 * const { startExport, isExporting } = useExportJob();
 * startExport('wagertxn', summaryParams);
 */
export const useExportJob = (): IUseExportJobResult => {
  const { t } = useTranslation();
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const { mutate, isPending } = useMutation({
    ...exportJobMutationOptions(),
    meta: { isGlobalErrorSuppressed: true }
  });

  const startExport = useCallback(
    (reportType: TExportReportType, input: object) => {
      const controller = new AbortController();

      abortControllerRef.current = controller;
      mutate(
        { reportType, input, signal: controller.signal },
        {
          onSuccess: downloadUrl => {
            window.location.assign(downloadUrl);
          },
          onError: error => {
            toast.error(buildExportErrorMessage(error, t));
          }
        }
      );
    },
    [mutate, t]
  );

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
    },
    []
  );

  return { startExport, isExporting: isPending };
};
