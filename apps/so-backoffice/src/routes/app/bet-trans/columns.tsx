import type { TxnWagerResult } from '@cbt-bo/api-schema/bo/models';
import { BaccaratCards } from '@cbt-bo/component-lib/components/game';
import { buildOffsetDateLabel } from '@cbt-bo/component-lib/components/header/TimezoneClock/utils';
import {
  CellPairs,
  ETableView,
  type IDataTableColumn
} from '@cbt-bo/component-lib/components/table';
import { formatMinorAmount } from '@cbt-bo/component-lib/lib/format';
import { cn } from '@cbt-bo/component-lib/lib/utils';
import type { TFunction } from 'i18next';
import { sift } from 'radash';

import { buildCopyableValue } from '#/components/table/cells';

const BADGE_TONES: Readonly<Record<string, string>> = {
  normal: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  result: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  cancel: 'bg-muted text-muted-foreground',
  error: 'bg-destructive/10 text-destructive',
  win: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  lose: 'bg-destructive/10 text-destructive',
  tie: 'bg-muted text-muted-foreground'
} as const;

const buildTimeLabel = (value: string | undefined, timezoneMinutes: number) =>
  value ? buildOffsetDateLabel(new Date(value), timezoneMinutes) : undefined;

const buildBadge = (t: TFunction, group: 'betState' | 'betResult', value?: string) =>
  value ? (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-0.5 text-sm font-medium',
        BADGE_TONES[value]
      )}
    >
      {t(`betTrans.${group}Option.${value}`, { defaultValue: value })}
    </span>
  ) : undefined;

const buildBetTransDetailColumns = (t: TFunction): IDataTableColumn<TxnWagerResult>[] => {
  const baccaratLabels = {
    player: t('game.baccaratSide.player'),
    banker: t('game.baccaratSide.banker'),
    tie: t('game.baccaratSide.tie')
  };

  return [
    {
      key: 'gameResult',
      title: t('betTrans.gameResult'),
      width: 440,
      render: ({ gameResult = {} }) => {
        const { roundCard, roundResult, ...details } = gameResult;
        const entries = Object.entries(details);
        const pairs = entries.map(([label, value]) => ({
          label,
          value: label === 'shoeId' ? buildCopyableValue(t, value, true) : value
        }));
        const isBlank = !roundCard && !pairs.length;

        if (isBlank) return '-';

        return (
          <div className="flex flex-col gap-1.5">
            {roundCard && (
              <BaccaratCards
                roundCard={roundCard}
                roundResult={roundResult}
                labels={baccaratLabels}
              />
            )}
            {pairs.length > 0 && <CellPairs pairs={pairs} />}
          </div>
        );
      }
    },
    {
      key: 'other',
      title: t('betTrans.other'),
      width: 320,
      render: ({ betCode, sessionId, betRemark }) => (
        <CellPairs
          pairs={[
            { label: t('betTrans.betCode'), value: betCode },
            { label: t('betTrans.sessionId'), value: buildCopyableValue(t, sessionId, true) },
            { label: t('betTrans.betRemark'), value: betRemark }
          ]}
        />
      )
    }
  ];
};

/**
 * Columns of the bet transactions list, labelled through `t`. Related fields
 * share one cell. Amounts arrive in minor units, and times render at
 * `timezoneMinutes` from UTC. The `detail` view adds the player type and
 * session ID, the currency, the game result and the bet code, session and remark.
 */
export const buildBetTransColumns = (
  t: TFunction,
  timezoneMinutes: number,
  view: ETableView
): IDataTableColumn<TxnWagerResult>[] => {
  const isDetailed = view === ETableView.DETAIL;
  const detailColumns = isDetailed ? buildBetTransDetailColumns(t) : [];

  return [
    {
      key: 'player',
      title: t('betTrans.player'),
      width: 360,
      fixed: 'start',
      render: ({ playerId, playerCode, patronNumber, mobile, playerType, sessionId }) => (
        <CellPairs
          pairs={sift([
            { label: t('player.playerId'), value: buildCopyableValue(t, playerId) },
            { label: t('player.patronNumber'), value: buildCopyableValue(t, patronNumber) },
            { label: t('player.mobile'), value: buildCopyableValue(t, mobile) },
            { label: t('player.playerCode'), value: playerCode },
            isDetailed && { label: t('player.playerType'), value: playerType },
            isDetailed && {
              label: t('betTrans.sessionId'),
              value: buildCopyableValue(t, sessionId, true)
            }
          ])}
        />
      )
    },
    {
      key: 'amount',
      title: t('betTrans.amount'),
      width: 230,
      render: ({ betAmt, betAdjAmt, betRetAmt, payout }) => (
        <CellPairs
          isNumeric
          pairs={[
            { label: t('betTrans.betAmt'), value: formatMinorAmount(betAmt) },
            { label: t('betTrans.betAdjAmt'), value: formatMinorAmount(betAdjAmt) },
            { label: t('betTrans.payout'), value: formatMinorAmount(payout) },
            { label: t('betTrans.betRetAmt'), value: formatMinorAmount(betRetAmt) }
          ]}
        />
      )
    },
    {
      key: 'state',
      title: t('betTrans.state'),
      width: 230,
      render: ({ betState, betResult }) => (
        <CellPairs
          className="gap-y-1"
          pairs={[
            { label: t('betTrans.betState'), value: buildBadge(t, 'betState', betState) },
            { label: t('betTrans.betResult'), value: buildBadge(t, 'betResult', betResult) }
          ]}
        />
      )
    },
    {
      key: 'time',
      title: t('betTrans.time'),
      width: 290,
      render: ({ betTime, settleTime }) => (
        <CellPairs
          pairs={[
            { label: t('betTrans.betTime'), value: buildTimeLabel(betTime, timezoneMinutes) },
            { label: t('betTrans.settleTime'), value: buildTimeLabel(settleTime, timezoneMinutes) }
          ]}
        />
      )
    },
    {
      key: 'game',
      title: t('betTrans.game'),
      width: 340,
      render: ({ gameName, gameId, gameGpId, gameGenre, extRoundId }) => (
        <CellPairs
          pairs={[
            { label: t('betTrans.gameName'), value: gameName?.en },
            { label: t('betTrans.gameId'), value: buildCopyableValue(t, gameId) },
            { label: t('betTrans.gameGpId'), value: buildCopyableValue(t, gameGpId) },
            { label: t('betTrans.gameGenre'), value: gameGenre },
            { label: t('betTrans.extRoundId'), value: buildCopyableValue(t, extRoundId, true) }
          ]}
        />
      )
    },
    {
      key: 'transaction',
      title: t('betTrans.transaction'),
      width: 440,
      render: ({ id, extTxnId, txnType, currencyId }) => (
        <CellPairs
          pairs={sift([
            { label: t('betTrans.id'), value: buildCopyableValue(t, id, true) },
            { label: t('betTrans.extTxnId'), value: buildCopyableValue(t, extTxnId, true) },
            {
              label: t('betTrans.txnType'),
              value: txnType && t(`betTrans.txnTypeOption.${txnType}`, { defaultValue: txnType })
            },
            isDetailed && { label: t('betTrans.currencyId'), value: currencyId }
          ])}
        />
      )
    },
    ...detailColumns
  ];
};
