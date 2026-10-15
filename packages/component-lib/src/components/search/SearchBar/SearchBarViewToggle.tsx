import { ToggleGroup } from 'radix-ui';

import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISearchBarViewOption<TValue extends string> {
  value: TValue;
  label: string;
}

export interface ISearchBarViewToggleProps<TValue extends string> {
  value: TValue;
  options: readonly ISearchBarViewOption<TValue>[];
  onValueChange: (value: TValue) => void;
  label: string;
  className?: string;
}

/**
 * Segmented switch between list views, such as a simple and a detailed table,
 * exposed as `SearchBar.ViewToggle`. It is controlled and not bound to the
 * bar's form, so reset and search leave it alone.
 *
 * @example
 * <SearchBar.Actions resetLabel="Reset" submitLabel="Search">
 *   <SearchBar.ViewToggle label="View" value={view} options={viewOptions} onValueChange={setView} />
 * </SearchBar.Actions>
 */
const SearchBarViewToggle = <TValue extends string>({
  value,
  options,
  onValueChange,
  label,
  className
}: ISearchBarViewToggleProps<TValue>) => {
  const handleValueChange = (next: string) => {
    const option = options.find(candidate => candidate.value === next);

    if (option) onValueChange(option.value);
  };

  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={handleValueChange}
      aria-label={label}
      data-slot="search-bar-view-toggle"
      className={cn(
        'inline-flex h-8 items-center gap-0.5 rounded-sm border border-input bg-background p-0.5 shadow-xs',
        className
      )}
    >
      {options.map(option => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className="h-full cursor-pointer rounded-sm px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
};

export default SearchBarViewToggle;
