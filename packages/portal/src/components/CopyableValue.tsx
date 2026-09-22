import { useTranslation } from 'react-i18next';

import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { useClipboard } from '~/hooks/use-clipboard';

export interface ICopyableValueProps {
  value: string | number;
  minWidth?: number;
}

const COPIED_TIMEOUT_MS = 1500;

/**
 * Text that copies itself to the clipboard on double click.
 */
const CopyableValue = ({ value, minWidth }: ICopyableValueProps) => {
  const { t } = useTranslation();
  const { isCopied, copy } = useClipboard(COPIED_TIMEOUT_MS);

  return (
    <Tooltip open={isCopied}>
      <TooltipTrigger asChild>
        <span
          className="inline-block cursor-default text-sm select-text"
          style={{ minWidth }}
          onDoubleClick={() => {
            copy(String(value));
          }}
        >
          {value}
        </span>
      </TooltipTrigger>
      <TooltipContent>{t('common.copied')}</TooltipContent>
    </Tooltip>
  );
};

export default CopyableValue;
