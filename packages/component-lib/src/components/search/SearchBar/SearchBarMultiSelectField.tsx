import { useFormContext } from 'react-hook-form';

import MultiSelectField from '@cbt-bo/component-lib/components/forms/MultiSelectField';
import type { ISelectOption } from '@cbt-bo/component-lib/components/forms/SelectField';
import { useSearchBar } from '@cbt-bo/component-lib/components/search/SearchBar/search-bar-context';
import { cn } from '@cbt-bo/component-lib/lib/utils';

/**
 * Columns of `SearchBar.Fields` a wide field spans.
 */
export type TSearchBarFieldSpan = 2 | 3 | 4 | 5;

export interface ISearchBarMultiSelectFieldProps {
  name: string;
  label: string;
  options: readonly ISelectOption[];
  removeLabel: string;
  /**
   * Columns of `SearchBar.Fields` the field spans once the panel has that
   * many, taking the whole row before. Defaults to DEFAULT_SPAN.
   */
  span?: TSearchBarFieldSpan;
  /**
   * Placeholder of the search box while nothing is picked.
   */
  allLabel?: string;
  /**
   * Accessible name of the clear button shown while the field holds a value.
   * Defaults to the `clearLabel` of `SearchBar.Root`.
   */
  clearLabel?: string;
  noResultsLabel?: string;
  /**
   * Text of the badge standing in for the chips that do not fit on the line,
   * given their count. Defaults to `+<count>`.
   */
  formatHiddenCount?: (count: number) => string;
  /**
   * Most chips shown at once, whatever the room. The rest fold into the
   * badge. Without it every chip that fits shows.
   */
  maxChips?: number;
  className?: string;
}

const DEFAULT_SPAN = 2 satisfies TSearchBarFieldSpan;

const SPAN_CLASSES = {
  2: 'col-span-full @min-[21rem]:col-span-2',
  3: 'col-span-full @min-[31rem]:col-span-3',
  4: 'col-span-full @min-[42rem]:col-span-4',
  5: 'col-span-full @min-[52rem]:col-span-5'
} as const satisfies Record<TSearchBarFieldSpan, string>;

/**
 * Searchable multi-value select filter bound to `name` on the bar's form,
 * exposed as `SearchBar.MultiSelectField`. The field holds a string array,
 * empty while the filter is not applied. It spans `span` columns of
 * `SearchBar.Fields`, so more chips fit on its line.
 */
const SearchBarMultiSelectField = ({
  name,
  label,
  options,
  removeLabel,
  span = DEFAULT_SPAN,
  allLabel,
  clearLabel,
  noResultsLabel,
  formatHiddenCount,
  maxChips,
  className
}: ISearchBarMultiSelectFieldProps) => {
  const { control } = useFormContext();
  const { clearLabel: defaultClearLabel } = useSearchBar();

  return (
    <div
      data-slot="search-bar-multi-select-field"
      className={cn('min-w-0', SPAN_CLASSES[span], className)}
    >
      <MultiSelectField
        control={control}
        name={name}
        label={label}
        options={options}
        removeLabel={removeLabel}
        placeholder={allLabel}
        clearLabel={clearLabel ?? defaultClearLabel}
        noResultsLabel={noResultsLabel}
        formatHiddenCount={formatHiddenCount}
        maxChips={maxChips}
        size="sm"
      />
    </div>
  );
};

export default SearchBarMultiSelectField;
