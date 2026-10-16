import { CopyableValue } from '@cbt-bo/component-lib/components/table';
import type { TFunction } from 'i18next';

/**
 * A `CopyableValue` cell with the `common.copy` and `common.copied` labels
 * resolved through `t`. Absent when the value is blank.
 *
 * @example
 * { label: t('player.playerId'), value: buildCopyableValue(t, playerId) }
 */
export const buildCopyableValue = (t: TFunction, value?: string, isShortened = false) =>
  value ? (
    <CopyableValue
      value={value}
      labels={{ copy: t('common.copy'), copied: t('common.copied') }}
      isShortened={isShortened}
    />
  ) : undefined;
