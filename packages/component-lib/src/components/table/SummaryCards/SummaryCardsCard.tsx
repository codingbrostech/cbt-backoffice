import { InfoIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Skeleton } from '@cbt-bo/component-lib/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@cbt-bo/component-lib/components/ui/tooltip';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISummaryCardsCardProps {
  label: string;
  value: ReactNode;
  tooltip?: string;
  isLoading?: boolean;
  className?: string;
}

/**
 * One total under its label, exposed as `SummaryCards.Card`. The card is never
 * narrower than its label and value, so neither is cut off. Needs a Radix
 * `TooltipProvider` above it when `tooltip` is set.
 */
const SummaryCardsCard = ({
  label,
  value,
  tooltip,
  isLoading = false,
  className
}: ISummaryCardsCardProps) => (
  <div
    data-slot="summary-cards-card"
    className={cn('flex min-w-max flex-1 flex-col gap-1 rounded-lg border bg-card p-3', className)}
  >
    <div className="flex items-center justify-between gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger
            type="button"
            aria-label={tooltip}
            className="shrink-0 cursor-help text-muted-foreground hover:text-foreground"
          >
            <InfoIcon className="size-3.5" />
          </TooltipTrigger>
          <TooltipContent side="top" align="end" className="max-w-64">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
    {isLoading ? (
      <Skeleton className="h-7 w-20" />
    ) : (
      <span className="text-xl font-semibold tabular-nums">{value}</span>
    )}
  </div>
);

export default SummaryCardsCard;
