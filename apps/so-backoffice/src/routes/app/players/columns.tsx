import type { PlayerListResultItem } from '@cbt-bo/api-schema/bo/models';
import {
  StateBadge,
  StateSelectBadge,
  type TStateBadgeVariants
} from '@cbt-bo/component-lib/components/badge';
import type { ISelectOption } from '@cbt-bo/component-lib/components/forms';
import { buildOffsetDateLabel } from '@cbt-bo/component-lib/components/header/TimezoneClock/utils';
import { CellPairs, type IDataTableColumn } from '@cbt-bo/component-lib/components/table';
import { Badge, type TBadgeVariant } from '@cbt-bo/component-lib/components/ui/badge';
import type { TFunction } from 'i18next';

import { buildCopyableValue } from '#/components/table/cells';

const EMPTY_VALUE = '-';
const KYC_STATE_BADGE_VARIANTS: TStateBadgeVariants = {
  reminder: 'warning',
  pending: 'info',
  approved: 'success',
  rejected: 'destructive-muted'
} as const;
const PLAYER_TYPE_BADGE_VARIANTS: Readonly<Record<string, TBadgeVariant>> = {
  player: 'info',
  guest: 'muted',
  agent: 'warning',
  staff: 'secondary'
} as const;

export interface IPlayerColumnOptions {
  timezoneMinutes: number;
  labelNameById: Readonly<Record<string, string>>;
  stateOptions: readonly ISelectOption[];
  kycStateOptions: readonly ISelectOption[];
  isUpdateAllowed: boolean;
  onStateChange: (player: PlayerListResultItem, state: string) => void;
  onKycStateChange: (player: PlayerListResultItem, kycState: string) => void;
}

const buildTimeLabel = (value: string | undefined, timezoneMinutes: number) =>
  value ? buildOffsetDateLabel(new Date(value), timezoneMinutes) : undefined;

const buildKycStateLabel = (t: TFunction, kycState: string) =>
  t(`players.kycStateOption.${kycState}`, { defaultValue: kycState });

const buildLabelBadges = (
  labelIds: readonly string[],
  labelNameById: Readonly<Record<string, string>>
) =>
  labelIds.length ? (
    <div className="flex flex-wrap gap-1">
      {labelIds.map(id => (
        <Badge key={id} variant="muted">
          {labelNameById[id] ?? id}
        </Badge>
      ))}
    </div>
  ) : (
    EMPTY_VALUE
  );

/**
 * Columns of the players list, labelled through `t`. Related fields share
 * one cell, label IDs resolve through `labelNameById`, and times render at
 * `timezoneMinutes` from UTC. With `isUpdateAllowed`, the state and KYC
 * state cells pick a new state from `stateOptions` and `kycStateOptions`
 * and report it through `onStateChange` and `onKycStateChange`.
 */
export const buildPlayerColumns = (
  t: TFunction,
  {
    timezoneMinutes,
    labelNameById,
    stateOptions,
    kycStateOptions,
    isUpdateAllowed,
    onStateChange,
    onKycStateChange
  }: IPlayerColumnOptions
): IDataTableColumn<PlayerListResultItem>[] => [
  {
    key: 'player',
    title: t('players.player'),
    width: 240,
    fixed: 'start',
    render: ({ id, patronNumber, mobile }) => (
      <CellPairs
        pairs={[
          { label: t('player.playerId'), value: buildCopyableValue(t, id) },
          { label: t('player.patronNumber'), value: buildCopyableValue(t, patronNumber) },
          { label: t('player.mobile'), value: buildCopyableValue(t, mobile), isSecondary: true }
        ]}
      />
    )
  },
  {
    key: 'profile',
    title: t('players.profile'),
    width: 420,
    render: ({ firstName, lastName, email }) => (
      <CellPairs
        columns={2}
        isTruncated
        className="text-xs"
        pairs={[
          { label: t('players.firstName'), value: firstName },
          { label: t('players.lastName'), value: lastName },
          { label: t('players.email'), value: email }
        ]}
      />
    )
  },
  {
    key: 'state',
    title: t('players.state'),
    width: 120,
    render: player => {
      const { state } = player;

      if (!state) return EMPTY_VALUE;

      const label = t(`state.${state}`, { defaultValue: state });

      return isUpdateAllowed ? (
        <StateSelectBadge
          state={state}
          options={stateOptions}
          onStateChange={next => {
            onStateChange(player, next);
          }}
        >
          {label}
        </StateSelectBadge>
      ) : (
        <StateBadge state={state}>{label}</StateBadge>
      );
    }
  },
  {
    key: 'kyc',
    title: t('players.kyc'),
    width: 220,
    render: player => {
      const { kycState = '', applicantId } = player;

      const kycStateLabel = kycState && buildKycStateLabel(t, kycState);
      const kycStateBadge = kycState ? (
        <StateBadge state={kycState} variants={KYC_STATE_BADGE_VARIANTS}>
          {kycStateLabel}
        </StateBadge>
      ) : undefined;

      return (
        <CellPairs
          className="gap-y-1 text-xs"
          pairs={[
            {
              label: t('players.state'),
              value: isUpdateAllowed ? (
                <StateSelectBadge
                  state={kycState}
                  variants={KYC_STATE_BADGE_VARIANTS}
                  options={kycStateOptions}
                  placeholder={t('common.notSet')}
                  onStateChange={next => {
                    onKycStateChange(player, next);
                  }}
                >
                  {kycStateLabel}
                </StateSelectBadge>
              ) : (
                kycStateBadge
              )
            },
            { label: t('players.applicantId'), value: buildCopyableValue(t, applicantId, true) }
          ]}
        />
      );
    }
  },
  {
    key: 'type',
    title: t('player.playerType'),
    width: 134,
    render: ({ type }) =>
      type ? (
        <Badge variant={PLAYER_TYPE_BADGE_VARIANTS[type] ?? 'muted'}>
          {t(`players.typeOption.${type}`, { defaultValue: type })}
        </Badge>
      ) : (
        EMPTY_VALUE
      )
  },
  {
    key: 'labels',
    title: t('players.labels'),
    width: 320,
    render: ({ labels = [] }) => buildLabelBadges(labels, labelNameById)
  },
  {
    key: 'time',
    title: t('players.time'),
    width: 290,
    render: ({ crtTime, lastAccessTime }) => (
      <CellPairs
        className="text-xs"
        pairs={[
          { label: t('players.crtTime'), value: buildTimeLabel(crtTime, timezoneMinutes) },
          {
            label: t('players.lastAccessTime'),
            value: buildTimeLabel(lastAccessTime, timezoneMinutes)
          }
        ]}
      />
    )
  }
];
