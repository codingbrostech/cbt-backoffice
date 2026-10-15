import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import SubmitButton from '@cbt-bo/component-lib/components/forms/SubmitButton';
import { useTrailingSpan } from '@cbt-bo/component-lib/components/search/SearchBar/use-trailing-span';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISearchBarActionsProps {
  resetLabel: string;
  submitLabel: string;
  isLoading?: boolean;
  /**
   * Extra controls rendered before the reset and search buttons.
   */
  children?: ReactNode;
  className?: string;
}

/**
 * Reset and search buttons at the end of the fields row, exposed as
 * `SearchBar.Actions`. Reset returns every field to the root's
 * `defaultValues` and searches with them. The buttons span as many of the
 * last grid columns as they need side by side, so they share the last row
 * with the fields when it has room and start a new row otherwise.
 */
const SearchBarActions = ({
  resetLabel,
  submitLabel,
  isLoading,
  children,
  className
}: ISearchBarActionsProps) => {
  const { control } = useFormContext();
  const { ref, span } = useTrailingSpan<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-slot="search-bar-actions"
      className={cn('col-[span_2/-1] flex flex-wrap items-center justify-end gap-2', className)}
      style={span ? { gridColumn: `span ${span} / -1` } : undefined}
    >
      {children}
      <Button type="reset" variant="outline" disabled={isLoading}>
        {resetLabel}
      </Button>
      <SubmitButton control={control} label={submitLabel} isLoading={isLoading} />
    </div>
  );
};

export default SearchBarActions;
