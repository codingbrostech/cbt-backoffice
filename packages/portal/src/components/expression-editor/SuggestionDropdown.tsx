import type { SuggestionKeyDownProps } from '@tiptap/suggestion';
import { forwardRef, useImperativeHandle, useState } from 'react';

import { cn } from '~/lib/utils';

export interface ISuggestionItem {
  label: string;
}

export interface ISuggestionDropdownRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

export interface ISuggestionDropdownProps {
  items: ISuggestionItem[];
  command: (item: ISuggestionItem) => void;
}

/**
 * Keyboard-navigable list rendered by the mention suggestion plugin.
 */
const SuggestionDropdown = forwardRef<ISuggestionDropdownRef, ISuggestionDropdownProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = items[index];
      if (item) command(item);
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (!items.length) return false;

        if (event.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }

        return false;
      }
    }));

    if (!items.length) return null;

    return (
      <div className="max-h-60 min-w-40 overflow-auto rounded-md border bg-popover p-1 text-sm text-popover-foreground shadow-md">
        {items.map((item, index) => (
          <div
            key={item.label}
            role="option"
            aria-selected={index === selectedIndex}
            className={cn(
              'cursor-pointer rounded-sm px-2 py-1',
              index === selectedIndex && 'bg-accent text-accent-foreground'
            )}
            onMouseDown={event => {
              event.preventDefault();
              selectItem(index);
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  }
);

SuggestionDropdown.displayName = 'SuggestionDropdown';

export default SuggestionDropdown;
