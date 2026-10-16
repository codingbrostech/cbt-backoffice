import { useFormContext } from 'react-hook-form';

import SelectField, {
  type ISelectOption
} from '@cbt-bo/component-lib/components/forms/SelectField';
import { useSearchBar } from '@cbt-bo/component-lib/components/search/SearchBar/search-bar-context';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISearchBarSelectFieldProps {
  name: string;
  label: string;
  options: readonly ISelectOption[];
  allLabel?: string;
  clearLabel?: string;
  noResultsLabel?: string;
  className?: string;
}

/**
 * Searchable select filter bound to `name` on the bar's form, exposed as
 * `SearchBar.SelectField`.
 */
const SearchBarSelectField = ({
  name,
  label,
  options,
  allLabel,
  clearLabel,
  noResultsLabel,
  className
}: ISearchBarSelectFieldProps) => {
  const { control } = useFormContext();
  const { clearLabel: defaultClearLabel } = useSearchBar();

  return (
    <div data-slot="search-bar-select-field" className={cn('min-w-0', className)}>
      <SelectField
        control={control}
        name={name}
        label={label}
        options={options}
        emptyLabel={allLabel}
        clearLabel={clearLabel ?? defaultClearLabel}
        noResultsLabel={noResultsLabel}
        size="sm"
      />
    </div>
  );
};

export default SearchBarSelectField;
