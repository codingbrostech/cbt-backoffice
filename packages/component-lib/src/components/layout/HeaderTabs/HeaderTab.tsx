import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';

import { TabsTrigger } from '@cbt-bo/component-lib/components/ui/tabs';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IHeaderTab {
  key: string;
  label: string;
}

export interface IHeaderTabProps {
  tab: IHeaderTab;
  isActive: boolean;
  isClosable: boolean;
  isDraggable: boolean;
  /**
   * Accessible label for the close button.
   */
  closeTabLabel: string;
  onClose: (key: string) => void;
}

/**
 * One tab in the header strip. While `isDraggable`, it is sortable through
 * the enclosing `SortableContext`, so the whole tab is the drag handle and
 * it slides along the strip while another tab is dragged past it. The strip
 * draws the underline. An inactive tab stops 1px above it, so the line keeps
 * one color across tabs and gaps even where the border token is translucent,
 * and only the active tab covers it. In dark mode an inactive tab also carries
 * the frame, drawn over the page rather than the tab surface so it matches the
 * underline's shade, since the muted surface alone barely separates from the
 * page there.
 */
const HeaderTab = ({
  tab,
  isActive,
  isClosable,
  isDraggable,
  closeTabLabel,
  onClose
}: IHeaderTabProps) => {
  const { setNodeRef, listeners, transform, transition, isDragging } = useSortable({
    id: tab.key,
    disabled: !isDraggable
  });

  const style = { transform: CSS.Translate.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative mb-px inline-flex h-[33px] flex-none items-stretch overflow-hidden rounded-t-sm rounded-b-none border border-b-0 border-transparent bg-muted transition-[background-color,border-color] duration-150 ease-out',
        'hover:bg-muted/70',
        isDraggable && 'touch-none',
        isActive
          ? 'mb-0 h-[34px] border-b border-border border-b-transparent bg-card font-medium hover:bg-card'
          : 'dark:border-border dark:bg-clip-padding',
        isDragging && 'z-10 shadow-md'
      )}
      {...listeners}
    >
      <TabsTrigger
        value={tab.key}
        className={cn(
          'h-full flex-none cursor-pointer rounded-none border-0 bg-transparent px-0 pl-3 text-sm font-normal text-foreground shadow-none after:hidden hover:bg-transparent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:text-primary data-[state=active]:shadow-none',
          isClosable ? 'pr-1' : 'pr-3'
        )}
      >
        <span className="grid">
          <span className="[grid-area:1/1]">{tab.label}</span>
          <span aria-hidden className="invisible [grid-area:1/1] font-medium">
            {tab.label}
          </span>
        </span>
      </TabsTrigger>
      {isClosable && (
        <button
          type="button"
          aria-label={closeTabLabel}
          className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center pr-1 text-muted-foreground hover:text-foreground"
          onClick={event => {
            event.stopPropagation();
            onClose(tab.key);
          }}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
};

export default HeaderTab;
