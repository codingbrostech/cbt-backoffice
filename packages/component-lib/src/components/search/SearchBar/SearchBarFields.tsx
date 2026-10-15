import type { ReactNode } from 'react';

import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISearchBarFieldsProps {
  /**
   * The field parts followed by `SearchBar.Actions`.
   */
  children: ReactNode;
  className?: string;
}

/**
 * Grid of fields with equal columns at least 10rem wide, exposed as
 * `SearchBar.Fields`. Aligns every field to its bottom edge so the buttons in
 * `SearchBar.Actions` line up with the inputs.
 */
const SearchBarFields = ({ children, className }: ISearchBarFieldsProps) => (
  <div
    data-slot="search-bar-fields"
    className={cn(
      '@container grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] items-end gap-x-2 gap-y-3 [&_[data-slot=field-label]]:text-xs [&_[data-slot=field]]:gap-0.5',
      className
    )}
  >
    {children}
  </div>
);

export default SearchBarFields;
