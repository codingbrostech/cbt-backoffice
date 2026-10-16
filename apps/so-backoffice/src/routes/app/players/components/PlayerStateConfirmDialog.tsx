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
import type { TFunction } from 'i18next';
import { Trans, useTranslation } from 'react-i18next';

import { useUpdatePlayerState } from '#/routes/app/players/hooks/use-update-player-state';

export interface IPlayerStateChange {
  player: PlayerListResultItem;
  state: string;
}

export interface IPlayerStateConfirmDialogProps {
  isOpen: boolean;
  change?: IPlayerStateChange;
  onOpenChange: (isOpen: boolean) => void;
}

const buildStateLabel = (t: TFunction, state: string) =>
  t(`state.${state}`, { defaultValue: state });

/**
 * Confirmation dialog around a player state picked in the list. It shows
 * the player's ID and patron ID and closes once the update succeeds.
 */
const PlayerStateConfirmDialog = ({
  isOpen,
  change,
  onOpenChange
}: IPlayerStateConfirmDialogProps) => {
  const { t } = useTranslation();
  const { updatePlayerState, isPending } = useUpdatePlayerState();

  const { player, state = '' } = change ?? {};
  const { id, patronNumber, state: currentState = '' } = player ?? {};
  const fromLabel = buildStateLabel(t, currentState);
  const toLabel = buildStateLabel(t, state);

  const confirm = async () => {
    if (!id) return;

    const isSaved = await updatePlayerState({ playerId: id, playerState: state });

    if (isSaved) onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('players.stateChange.title')}</DialogTitle>
          <DialogDescription>
            <Trans
              i18nKey="players.stateChange.confirm"
              values={{ from: fromLabel, to: toLabel }}
              components={{ strong: <strong className="text-foreground" /> }}
            />
          </DialogDescription>
        </DialogHeader>
        <CellPairs
          className="font-normal"
          pairs={[
            { label: t('player.playerId'), value: id },
            { label: t('player.patronNumber'), value: patronNumber }
          ]}
        />
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

export default PlayerStateConfirmDialog;
