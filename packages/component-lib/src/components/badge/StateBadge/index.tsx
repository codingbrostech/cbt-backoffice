import type { ComponentProps } from 'react';

import { Badge, type TBadgeVariant } from '@cbt-bo/component-lib/components/ui/badge';

export type TStateBadgeVariants = Readonly<Record<string, TBadgeVariant>>;

const STATE_BADGE_VARIANTS: TStateBadgeVariants = {
  active: 'success',
  inactive: 'muted',
  freeze: 'warning',
  delete: 'destructive-muted'
} as const;

const UNKNOWN_STATE_VARIANT = 'muted' satisfies TBadgeVariant;

export interface IStateBadgeProps extends Omit<ComponentProps<typeof Badge>, 'variant'> {
  state: string;
  variants?: TStateBadgeVariants;
}

/**
 * `Badge` toned by a record state through `variants`, or by
 * UNKNOWN_STATE_VARIANT for a state without a tone. The label is its
 * `children`.
 *
 * @example
 * <StateBadge state={state}>{t(`state.${state}`, { defaultValue: state })}</StateBadge>
 */
const StateBadge = ({
  state,
  variants = STATE_BADGE_VARIANTS,
  ...badgeProps
}: IStateBadgeProps) => (
  <Badge variant={variants[state] ?? UNKNOWN_STATE_VARIANT} {...badgeProps} />
);

export default StateBadge;
