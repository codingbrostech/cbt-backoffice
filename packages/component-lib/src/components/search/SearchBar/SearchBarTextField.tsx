import type { HTMLInputTypeAttribute } from 'react';
import { useFormContext } from 'react-hook-form';

import TextField from '@cbt-bo/component-lib/components/forms/TextField';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISearchBarTextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  /**
   * Input type, such as `datetime-local` for a time bound. Defaults to `text`.
   */
  type?: HTMLInputTypeAttribute;
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
  className
}: ISearchBarTextFieldProps) => {
  const { control } = useFormContext();

  return (
    <div data-slot="search-bar-text-field" className={cn('min-w-0', className)}>
      <TextField
        control={control}
        name={name}
        label={label}
        placeholder={placeholder}
        type={type}
        size="sm"
      />
    </div>
  );
};

export default SearchBarTextField;
