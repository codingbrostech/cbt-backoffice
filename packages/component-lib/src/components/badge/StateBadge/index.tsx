import type { ComponentProps } from 'react';

import { Badge, type TBadgeVariant } from '@cbt-bo/component-lib/components/ui/badge';

const STATE_BADGE_VARIANTS: Readonly<Record<string, TBadgeVariant>> = {
  active: 'success',
  inactive: 'muted'
} as const;

const UNKNOWN_STATE_VARIANT = 'muted' satisfies TBadgeVariant;

export interface IStateBadgeProps extends Omit<ComponentProps<typeof Badge>, 'variant'> {
  /**
   * Record state that picks the tone, such as `active`.
   */
  state: string;
}

/**
 * `Badge` toned by a record state through STATE_BADGE_VARIANTS, or by
 * UNKNOWN_STATE_VARIANT for a state without a tone. The label is its
 * `children`.
 *
 * @example
 * <StateBadge state={state}>{t(`state.${state}`, { defaultValue: state })}</StateBadge>
 */
const StateBadge = ({ state, ...badgeProps }: IStateBadgeProps) => (
  <Badge variant={STATE_BADGE_VARIANTS[state] ?? UNKNOWN_STATE_VARIANT} {...badgeProps} />
);

export default StateBadge;
