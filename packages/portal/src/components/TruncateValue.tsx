import CopyButton from '~/components/CopyButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

export interface ITruncateValueProps {
  value: string | number;
}

const VISIBLE_LENGTH = 6;

const TruncateValue = ({ value }: ITruncateValueProps) => {
  const text = String(value);
  const visibleText = text.substring(0, VISIBLE_LENGTH);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1">
          <CopyButton value={text} />
          <span>{visibleText ? `${visibleText}...` : ''}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
};

export default TruncateValue;
