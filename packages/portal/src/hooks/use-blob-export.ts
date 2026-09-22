import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useNotification } from '~/hooks/use-notification';
import type { IMgtBlobResult } from '~/services/mgt';
import dayjs from '~/utils/date';
import { buildExportErrorMessage, downloadBlob } from '~/utils/export-excel';

export interface IUseBlobExportOptions<TInput extends object> {
  action: (input: TInput) => Promise<IMgtBlobResult>;
  /**
   * File name prefix. The download is named `<prefix>_<timestamp>.<ext>`.
   */
  filePrefix: string;
}

export interface IUseBlobExportResult<TInput extends object> {
  isExporting: boolean;
  exportList: (input: TInput) => void;
}

/**
 * Runs a blob export action and downloads the returned file.
 *
 * @example
 * const { isExporting, exportList } = useBlobExport({
 *   action: exportPlayerMobilePolicies,
 *   filePrefix: 'playermobilepolicy'
 * });
 */
export const useBlobExport = <TInput extends object>({
  action,
  filePrefix
}: IUseBlobExportOptions<TInput>): IUseBlobExportResult<TInput> => {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const [isExporting, setIsExporting] = useState(false);

  const exportList = useCallback(
    (input: TInput) => {
      const run = async () => {
        setIsExporting(true);
        try {
          const { blob, extension } = await action(input);
          const now = dayjs().format('YYYYMMDDHHmmss');

          downloadBlob(blob, `${filePrefix}_${now}.${extension}`);
        } catch (err) {
          showErrorNotification({
            title: t('export.exportFailed'),
            message: buildExportErrorMessage(err, t('export.exportFailed'))
          });
        } finally {
          setIsExporting(false);
        }
      };

      void run();
    },
    [action, filePrefix, showErrorNotification, t]
  );

  return { isExporting, exportList };
};
