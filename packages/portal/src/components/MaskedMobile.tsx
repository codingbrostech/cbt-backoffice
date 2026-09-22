import type { RowData } from '@tanstack/react-table';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { useDisclosure } from '~/hooks/use-disclosure';
import { usePlayerButtonPermission } from '~/hooks/use-player-button-permission';
import type { IFieldOptions } from '~/table/build-column-defs';
import { maskMobile } from '~/utils/player-info';

export interface IMaskedMobileProps {
  mobile: string;
  dialCode?: string;
  minWidth?: number;
}

const MOBILE_TEXT_MIN_WIDTH = 90;

const MaskedMobile = ({
  mobile,
  dialCode,
  minWidth = MOBILE_TEXT_MIN_WIDTH
}: IMaskedMobileProps) => {
  const { t } = useTranslation();
  const { isMobileNoDetailVisible } = usePlayerButtonPermission();
  const [isRevealed, { toggle }] = useDisclosure();

  const displayedMobile = isRevealed ? mobile : maskMobile(mobile);
  const toggleLabel = isRevealed ? t('common.hide') : t('common.show');

  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <span className="text-sm" style={{ minWidth }}>
        {dialCode && `+${dialCode} `}
        {displayedMobile}
      </span>
      {isMobileNoDetailVisible && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground"
              aria-label={toggleLabel}
              onClick={toggle}
            >
              {isRevealed ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{toggleLabel}</TooltipContent>
        </Tooltip>
      )}
    </span>
  );
};

/**
 * Field options rendering the row's mobile number through `MaskedMobile`.
 */
export const buildMaskedMobileFieldOptions = <TRow extends RowData>(
  getMobile: (row: TRow) => string | null | undefined
): IFieldOptions<TRow> => ({
  formatterType: 'custom',
  formatterOptions: {
    customFormatter: row => {
      const mobile = getMobile(row);

      return mobile ? <MaskedMobile mobile={mobile} /> : '-';
    }
  }
});

export default MaskedMobile;
