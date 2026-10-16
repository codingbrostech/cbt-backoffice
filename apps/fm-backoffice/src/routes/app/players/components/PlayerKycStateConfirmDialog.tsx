import type { PlayerListResultItem } from '@cbt-bo/api-schema/bo/models';
import { CellPairs } from '@cbt-bo/component-lib/components/table';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@cbt-bo/component-lib/components/ui/dialog';
import { Field, FieldLabel } from '@cbt-bo/component-lib/components/ui/field';
import { Textarea } from '@cbt-bo/component-lib/components/ui/textarea';
import type { TFunction } from 'i18next';
import { useId, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useUpdatePlayerKycState } from '#/routes/app/players/hooks/use-update-player-kyc-state';

export interface IPlayerKycStateChange {
  player: PlayerListResultItem;
  kycState: string;
}

export interface IPlayerKycStateConfirmDialogProps {
  isOpen: boolean;
  change?: IPlayerKycStateChange;
  onOpenChange: (isOpen: boolean) => void;
}

const REMARK_ROWS = 3;

const buildKycStateLabel = (t: TFunction, kycState: string) =>
  t(`players.kycStateOption.${kycState}`, { defaultValue: kycState });

/**
 * Confirmation dialog around a KYC state picked in the list, with an
 * optional remark. It shows the player's ID and mobile number and closes
 * once the update succeeds.
 */
const PlayerKycStateConfirmDialog = ({
  isOpen,
  change,
  onOpenChange
}: IPlayerKycStateConfirmDialogProps) => {
  const { t } = useTranslation();
  const { updatePlayerKycState, isPending } = useUpdatePlayerKycState();
  const [opsRemark, setOpsRemark] = useState('');
  const remarkInputId = useId();

  const { player, kycState = '' } = change ?? {};
  const { id, mobile, kycState: currentKycState } = player ?? {};
  const fromLabel = currentKycState && buildKycStateLabel(t, currentKycState);
  const toLabel = buildKycStateLabel(t, kycState);
  const confirmKey = fromLabel ? 'players.kycStateChange.confirm' : 'players.kycStateChange.set';

  const close = (isNextOpen: boolean) => {
    if (!isNextOpen) setOpsRemark('');
    onOpenChange(isNextOpen);
  };

  const confirm = async () => {
    if (!id) return;

    const isSaved = await updatePlayerKycState({
      playerId: id,
      kycStatus: kycState,
      ...(opsRemark && { opsRemark })
    });

    if (isSaved) close(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('players.kycStateChange.title')}</DialogTitle>
          <DialogDescription>
            <Trans
              i18nKey={confirmKey}
              values={{ from: fromLabel, to: toLabel }}
              components={{ strong: <strong className="text-foreground" /> }}
            />
          </DialogDescription>
        </DialogHeader>
        <CellPairs
          className="font-normal"
          pairs={[
            { label: t('player.playerId'), value: id },
            { label: t('player.mobile'), value: mobile }
          ]}
        />
        <Field>
          <FieldLabel htmlFor={remarkInputId}>{t('players.opsRemark')}</FieldLabel>
          <Textarea
            id={remarkInputId}
            rows={REMARK_ROWS}
            className="rounded-sm text-sm focus-visible:ring-0"
            value={opsRemark}
            disabled={isPending}
            onChange={event => {
              setOpsRemark(event.target.value);
            }}
          />
        </Field>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              close(false);
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            disabled={isPending || !id}
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

export default PlayerKycStateConfirmDialog;
