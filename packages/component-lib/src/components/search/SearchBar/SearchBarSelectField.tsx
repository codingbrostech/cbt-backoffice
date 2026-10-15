import { useFormContext } from 'react-hook-form';

import SelectField, {
  type ISelectOption
} from '@cbt-bo/component-lib/components/forms/SelectField';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISearchBarSelectFieldProps {
  name: string;
  label: string;
  options: readonly ISelectOption[];
  /**
   * Label of the first option, which clears the filter. Shown while nothing
   * is picked, such as "All".
   */
  allLabel?: string;
  className?: string;
}

/**
 * Select filter bound to `name` on the bar's form, exposed as
 * `SearchBar.SelectField`.
 */
const SearchBarSelectField = ({
  name,
  label,
  options,
  allLabel,
  className
}: ISearchBarSelectFieldProps) => {
  const { control } = useFormContext();

  return (
    <div data-slot="search-bar-select-field" className={cn('min-w-0', className)}>
      <SelectField
        control={control}
        name={name}
        label={label}
        options={options}
        emptyLabel={allLabel}
        size="sm"
      />
    </div>
  );
};

export default SearchBarSelectField;
