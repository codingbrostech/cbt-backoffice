import type { HTMLInputTypeAttribute } from 'react';
import { useFormContext } from 'react-hook-form';

import TextField from '@cbt-bo/component-lib/components/forms/TextField';
import { useSearchBar } from '@cbt-bo/component-lib/components/search/SearchBar/search-bar-context';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISearchBarTextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  /**
   * Input type, such as `datetime-local` for a time bound. Defaults to `text`.
   */
  type?: HTMLInputTypeAttribute;
  clearLabel?: string;
  className?: string;
}

/**
 * Text filter bound to `name` on the bar's form, exposed as
 * `SearchBar.TextField`.
 */
const SearchBarTextField = ({
  name,
  label,
  placeholder,
  type = 'text',
  clearLabel,
  className
}: ISearchBarTextFieldProps) => {
  const { control } = useFormContext();
  const { clearLabel: defaultClearLabel } = useSearchBar();

  return (
    <div data-slot="search-bar-text-field" className={cn('min-w-0', className)}>
      <TextField
        control={control}
        name={name}
        label={label}
        placeholder={placeholder}
        type={type}
        clearLabel={clearLabel ?? defaultClearLabel}
        size="sm"
      />
    </div>
  );
};

export default SearchBarTextField;
