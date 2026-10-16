import type { GameProviderResult } from '@cbt-bo/api-schema/bo/models';
import { IconButton } from '@cbt-bo/component-lib/components/button';
import type { IDataTableColumn } from '@cbt-bo/component-lib/components/table';
import { Badge, type TBadgeVariant } from '@cbt-bo/component-lib/components/ui/badge';
import type { TFunction } from 'i18next';
import { FlaskConicalIcon, RotateCcwIcon } from 'lucide-react';

const EMPTY_VALUE = '-';
const ACTION_COLUMN_WIDTH_PX = 96;

const STATE_BADGE_VARIANTS: Readonly<Record<string, TBadgeVariant>> = {
  active: 'success',
  inactive: 'muted'
} as const;

/**
 * The only provider whose logout callbacks the MGT API can replay.
 */
export const RETRY_LOGOUT_PROVIDER_CODE = 'eslot';

export interface IGameProviderColumnActions {
  onStaffTestEdit: (provider: GameProviderResult) => void;
  onRetryLogout: (provider: GameProviderResult) => void;
  isUpdateAllowed: boolean;
}

/**
 * Columns of the game providers list, labelled through `t`. A blank value
 * renders as EMPTY_VALUE. `state` renders as a badge toned by
 * STATE_BADGE_VARIANTS and translates through `state.<value>` with the raw
 * value as the fallback, `isTest` renders as a yes/no badge, and the last
 * column holds the row actions. The logout retry action is offered for
 * RETRY_LOGOUT_PROVIDER_CODE alone.
 */
export const buildGameProviderColumns = (
  t: TFunction,
  { onStaffTestEdit, onRetryLogout, isUpdateAllowed }: IGameProviderColumnActions
): IDataTableColumn<GameProviderResult>[] => [
  {
    key: 'code',
    title: t('gameProviders.code'),
    fixed: 'start',
    render: ({ code }) => code ?? EMPTY_VALUE
  },
  { key: 'name', title: t('gameProviders.name'), render: ({ name }) => name ?? EMPTY_VALUE },
  {
    key: 'state',
    title: t('gameProviders.state'),
    render: ({ state }) =>
      state ? (
        <Badge variant={STATE_BADGE_VARIANTS[state] ?? 'muted'}>
          {t(`state.${state}`, { defaultValue: state })}
        </Badge>
      ) : (
        EMPTY_VALUE
      )
  },
  {
    key: 'isTest',
    title: t('gameProviders.isTest'),
    render: ({ isTest }) => (
      <Badge variant={isTest ? 'warning' : 'muted'}>{t(`common.${isTest ? 'yes' : 'no'}`)}</Badge>
    )
  },
  {
    key: 'endpointCurrency',
    title: t('gameProviders.endpointCurrency'),
    render: ({ endpointCurrency }) => endpointCurrency ?? EMPTY_VALUE
  },
  {
    key: 'action',
    title: t('common.action'),
    fixed: 'end',
    width: ACTION_COLUMN_WIDTH_PX,
    render: provider => (
      <div className="flex gap-2">
        <IconButton
          type="button"
          label={t('gameProviders.staffTestOnly.title')}
          variant="muted"
          size="icon-sm"
          disabled={!isUpdateAllowed || !provider.code}
          onClick={() => {
            onStaffTestEdit(provider);
          }}
        >
          <FlaskConicalIcon />
        </IconButton>
        {provider.code === RETRY_LOGOUT_PROVIDER_CODE && (
          <IconButton
            type="button"
            label={t('gameProviders.retryLogout.title')}
            variant="muted"
            size="icon-sm"
            disabled={!isUpdateAllowed}
            onClick={() => {
              onRetryLogout(provider);
            }}
          >
            <RotateCcwIcon />
          </IconButton>
        )}
      </div>
    )
  }
];
