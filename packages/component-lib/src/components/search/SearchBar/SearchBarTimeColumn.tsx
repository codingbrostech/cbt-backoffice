import { useEffect, useRef } from 'react';

import { Button } from '@cbt-bo/component-lib/components/ui/button';

export interface ISearchBarTimeColumnProps {
  label: string;
  options: readonly string[];
  value: string;
  isDisabled?: boolean;
  isOptionDisabled?: (option: string) => boolean;
  onSelect: (option: string) => void;
}

/**
 * Scrolling column of time options, one per row. The option matching `value`
 * is pressed and scrolls toward the top of the column whenever `value`
 * changes, stopping where the list ends.
 */
const SearchBarTimeColumn = ({
  label,
  options,
  value,
  isDisabled = false,
  isOptionDisabled,
  onSelect
}: ISearchBarTimeColumnProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const isScrollAnimatedRef = useRef(false);

  useEffect(() => {
    const list = listRef.current;
    const selected = list?.querySelector<HTMLElement>('[aria-pressed="true"]');

    if (!list || !selected) return;

    list.scrollTo({
      top: selected.offsetTop,
      behavior: isScrollAnimatedRef.current ? 'smooth' : 'instant'
    });
    isScrollAnimatedRef.current = true;
  }, [value]);

  return (
    <div
      ref={listRef}
      role="group"
      aria-label={label}
      className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-1 supports-[selector(::-webkit-scrollbar)]:[scrollbar-color:auto] supports-[selector(::-webkit-scrollbar)]:[scrollbar-width:auto] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
    >
      {options.map(option => (
        <Button
          key={option}
          type="button"
          variant="ghost"
          size="xs"
          aria-pressed={option === value}
          disabled={isDisabled || isOptionDisabled?.(option)}
          className="h-7 w-full font-normal tabular-nums aria-pressed:bg-primary/15 aria-pressed:font-medium"
          onClick={() => {
            onSelect(option);
          }}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default SearchBarTimeColumn;
