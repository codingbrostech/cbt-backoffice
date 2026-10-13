import type { ReactNode } from 'react';

import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISearchBarHeaderProps {
  title: string;
  /**
   * Content at the end of the row, such as a create button.
   */
  children?: ReactNode;
  className?: string;
}

/**
 * Title row of the bar, exposed as `SearchBar.Header`. Shows `title` at
 * the start and its children at the end.
 */
const SearchBarHeader = ({ title, children, className }: ISearchBarHeaderProps) => (
  <div
    data-slot="search-bar-header"
    className={cn('flex items-center justify-between gap-2', className)}
  >
    <h1 className="text-xl font-semibold">{title}</h1>
    {children}
  </div>
);

export default SearchBarHeader;
