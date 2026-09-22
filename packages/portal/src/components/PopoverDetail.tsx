import { Fragment } from 'react';

import ImageHoverButton from '~/components/ImageHoverButton';
import { Button } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { ScrollArea } from '~/components/ui/scroll-area';
import { cn } from '~/lib/utils';

export interface IPopoverDetailProps {
  buttonLabel: string;
  content: Record<string, React.ReactNode>;
  contentType?: 'text' | 'image';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  buttonSize?: React.ComponentProps<typeof Button>['size'];
}

const PopoverDetail = ({
  buttonLabel,
  content,
  contentType = 'text',
  isDisabled = false,
  isFullWidth = false,
  buttonSize = 'xs'
}: IPopoverDetailProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        type="button"
        size={buttonSize}
        disabled={isDisabled}
        className={cn(isFullWidth && 'w-full')}
      >
        {buttonLabel}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-80">
      <ScrollArea className="max-h-80">
        <div className="grid grid-cols-2 items-center gap-2 text-xs">
          {Object.entries(content).map(([key, value]) => (
            <Fragment key={key}>
              <span>{key}</span>
              {contentType === 'image' ? (
                typeof value === 'string' && <ImageHoverButton imgSrc={value} />
              ) : (
                <span>{value}</span>
              )}
            </Fragment>
          ))}
        </div>
      </ScrollArea>
    </PopoverContent>
  </Popover>
);

export default PopoverDetail;
