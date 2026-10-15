import CopyButton, {
  type ICopyButtonLabels
} from '@cbt-bo/component-lib/components/button/CopyButton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@cbt-bo/component-lib/components/ui/tooltip';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ICopyableValueProps {
  value: string;
  /**
   * Shows only the first and last SHORT_VALUE_EDGE_LENGTH characters, with
   * the full value in a tooltip, once the value is longer than
   * SHORT_VALUE_MIN_LENGTH.
   */
  isShortened?: boolean;
  labels: ICopyButtonLabels;
  className?: string;
}

const SHORT_VALUE_EDGE_LENGTH = 3;
const SHORT_VALUE_MIN_LENGTH = 10;

const buildShortValue = (value: string): string =>
  `${value.slice(0, SHORT_VALUE_EDGE_LENGTH)}…${value.slice(-SHORT_VALUE_EDGE_LENGTH)}`;

/**
 * A long identifier followed by a copy button, such as a transaction or round
 * ID. The full value wraps at any character to fit its container. Needs a
 * Radix `TooltipProvider` above it when `isShortened` is set.
 *
 * @example
 * <CopyableValue value={extRoundId} labels={{ copy: 'Copy', copied: 'Copied' }} isShortened />
 */
const CopyableValue = ({ value, isShortened = false, labels, className }: ICopyableValueProps) => {
  const isTruncated = isShortened && value.length > SHORT_VALUE_MIN_LENGTH;
  const shortValue = buildShortValue(value);

  return (
    <span data-slot="copyable-value" className={cn('inline-flex items-center gap-2', className)}>
      {isTruncated ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="whitespace-nowrap">{shortValue}</span>
          </TooltipTrigger>
          <TooltipContent side="top">{value}</TooltipContent>
        </Tooltip>
      ) : (
        <span className="min-w-0 [overflow-wrap:anywhere]">{value}</span>
      )}
      <CopyButton value={value} labels={labels} />
    </span>
  );
};

export default CopyableValue;
