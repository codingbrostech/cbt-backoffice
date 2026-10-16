import type { GameProviderResult } from '@cbt-bo/api-schema/bo/models';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@cbt-bo/component-lib/components/ui/dialog';
import { useTranslation } from 'react-i18next';

import { useRetryProviderLogout } from '#/routes/app/game-providers/hooks/use-retry-provider-logout';

export interface IRetryLogoutDialogProps {
  isOpen: boolean;
  /**
   * The provider whose failed logout callbacks are replayed. The dialog
   * renders nothing while it is absent.
   */
  provider?: GameProviderResult;
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * Confirmation dialog around the provider logout retry. It closes once the
 * request succeeds.
 */
const RetryLogoutDialog = ({ isOpen, provider, onOpenChange }: IRetryLogoutDialogProps) => {
  const { t } = useTranslation();
  const { retryProviderLogout, isPending } = useRetryProviderLogout();

  const { code: providerCode = '', name: providerName = providerCode } = provider ?? {};
  const providerLabel = providerName ? `${providerName} (${providerCode})` : providerCode;

  const confirm = async () => {
    const isRetried = await retryProviderLogout(providerCode);

    if (isRetried) onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('gameProviders.retryLogout.title')}</DialogTitle>
          <DialogDescription>
            {t('gameProviders.retryLogout.confirm', { provider: providerLabel })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              onOpenChange(false);
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            disabled={isPending || !providerCode}
            onClick={() => {
              void confirm();
            }}
          >
            {t('common.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RetryLogoutDialog;
