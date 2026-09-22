import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/ui/spinner';
import { usePlayerButtonPermission } from '~/hooks/use-player-button-permission';

export interface IExportButtonProps {
  isExporting: boolean;
  onExport: () => void;
}

/**
 * Export trigger gated by the role's export permission.
 */
const ExportButton = ({ isExporting, onExport }: IExportButtonProps) => {
  const { t } = useTranslation();
  const { isExportAllowed } = usePlayerButtonPermission();

  return (
    <Button type="button" disabled={!isExportAllowed || isExporting} onClick={onExport}>
      {isExporting && <Spinner />}
      {t('exportExcel')}
    </Button>
  );
};

export default ExportButton;
