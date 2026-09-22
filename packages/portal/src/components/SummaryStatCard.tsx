import { InfoIcon } from 'lucide-react';

import MaskedValue from '~/components/MaskedValue';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

export interface ISummaryStatCardProps {
  label: string;
  value: string;
  tooltip?: string;
  isSensitive?: boolean;
  isLoading?: boolean;
}

const SummaryStatCard = ({
  label,
  value,
  tooltip,
  isSensitive = false,
  isLoading = false
}: ISummaryStatCardProps) => {
  if (isLoading) return <Skeleton className="h-24 rounded-md" />;

  return (
    <Card className="py-4">
      <CardContent>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">
            {label}
          </span>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="size-4 shrink-0 text-muted-foreground" aria-label={tooltip} />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-xl font-bold break-words">
          {isSensitive ? <MaskedValue value={value} /> : value}
        </p>
      </CardContent>
    </Card>
  );
};

export default SummaryStatCard;
