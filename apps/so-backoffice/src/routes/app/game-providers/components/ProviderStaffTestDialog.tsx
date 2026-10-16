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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useUpdateProviderStaffTest } from '#/routes/app/game-providers/hooks/use-update-provider-staff-test';

export interface IProviderStaffTestDialogProps {
  isOpen: boolean;
  /**
   * The provider whose games are flagged. The dialog renders nothing while
   * it is absent.
   */
  provider?: GameProviderResult;
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * Dialog that sets `staffTestOnly` on every game of `provider`. Each action
 * asks for a confirmation first, and the dialog closes once the request
 * succeeds.
 */
const ProviderStaffTestDialog = ({
  isOpen,
  provider,
  onOpenChange
}: IProviderStaffTestDialogProps) => {
  const { t } = useTranslation();
  const [pendingValue, setPendingValue] = useState<boolean>();
  const { updateProviderStaffTest, isPending } = useUpdateProviderStaffTest();

  const { code: providerCode = '', name: providerName = providerCode } = provider ?? {};
  const providerLabel = providerName ? `${providerName} (${providerCode})` : providerCode;
  const isConfirming = pendingValue !== undefined;
  const actionLabel = t(
    pendingValue
      ? 'gameProviders.staffTestOnly.setStaffOnly'
      : 'gameProviders.staffTestOnly.openToPublic'
  );

  const close = (isNextOpen: boolean) => {
    setPendingValue(undefined);
    onOpenChange(isNextOpen);
  };

  const confirm = async () => {
    if (pendingValue === undefined) return;

    const isUpdated = await updateProviderStaffTest({
      providerCode,
      isStaffTestOnly: pendingValue
    });

    if (isUpdated) close(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('gameProviders.staffTestOnly.title')}</DialogTitle>
          <DialogDescription>
            {isConfirming
              ? t('gameProviders.staffTestOnly.confirm', {
                  action: actionLabel,
                  provider: providerLabel
                })
              : t('gameProviders.staffTestOnly.description')}
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm">
          <span className="text-muted-foreground">{t('gameProviders.staffTestOnly.provider')}</span>{' '}
          <span className="font-medium">{providerLabel}</span>
        </p>
        <DialogFooter>
          {isConfirming ? (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => {
                  setPendingValue(undefined);
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isPending}
                onClick={() => {
                  void confirm();
                }}
              >
                {t('common.confirm')}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={!providerCode}
                onClick={() => {
                  setPendingValue(false);
                }}
              >
                {t('gameProviders.staffTestOnly.openToPublic')}
              </Button>
              <Button
                type="button"
                disabled={!providerCode}
                onClick={() => {
                  setPendingValue(true);
                }}
              >
                {t('gameProviders.staffTestOnly.setStaffOnly')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderStaffTestDialog;
