import { CheckIcon, CopyIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { useClipboard } from '~/hooks/use-clipboard';

export interface ICopyButtonProps {
  value: string;
}

const CopyButton = ({ value }: ICopyButtonProps) => {
  const { t } = useTranslation();
  const { isCopied, copy } = useClipboard();

  const label = isCopied ? t('common.copied') : t('common.copy');

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={label}
          className={isCopied ? 'text-primary' : 'text-muted-foreground'}
          onClick={() => {
            copy(value);
          }}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
};

export default CopyButton;
