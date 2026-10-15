import { useRef, useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@cbt-bo/component-lib/components/ui/tooltip';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ITruncatedTextProps {
  text: string;
  className?: string;
}

/**
 * One line of text cut with an ellipsis to fit its container. Hovering shows
 * the full text in a tooltip, only while the text is cut. Needs a Radix
 * `TooltipProvider` above it.
 *
 * @example
 * <TruncatedText text={gameName} />
 */
const TruncatedText = ({ text, className }: ITruncatedTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const changeOpen = (isNextOpen: boolean) => {
    const { current: element } = ref;
    const isTruncated = Boolean(element && element.scrollWidth > element.clientWidth);

    setIsOpen(isNextOpen && isTruncated);
  };

  return (
    <Tooltip open={isOpen} onOpenChange={changeOpen}>
      <TooltipTrigger asChild>
        <span ref={ref} data-slot="truncated-text" className={cn('block truncate', className)}>
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-80">
        {text}
      </TooltipContent>
    </Tooltip>
  );
};

export default TruncatedText;
