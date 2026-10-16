import { type ReactNode, useMemo } from 'react';
import type { DefaultValues, FieldValues } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import { SearchBarContext } from '@cbt-bo/component-lib/components/search/SearchBar/search-bar-context';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISearchBarRootProps<TValues extends FieldValues> {
  defaultValues: DefaultValues<TValues>;
  values?: TValues;
  onSubmit: (values: TValues) => void;
  clearLabel?: string;
  /**
   * The bar's parts, usually `SearchBar.Header` then `SearchBar.Fields`.
   */
  children: ReactNode;
  className?: string;
}

const DEFAULT_CLEAR_LABEL = 'Clear';

/**
 * Root of the filter bar above a list, exposed as `SearchBar.Root`. It owns
 * the draft field values and shares them with the other parts through the
 * form context, so each field part takes only its `name` and labels. The
 * field parts take their clear button's name from its `clearLabel`.
 *
 * @example
 * <SearchBar.Root defaultValues={DEFAULT_FILTER} values={filter} onSubmit={search}>
 *   <SearchBar.Header title="Admins" />
 *   <SearchBar.Fields>
 *     <SearchBar.TextField name="code" label="Login" />
 *     <SearchBar.Actions resetLabel="Reset" submitLabel="Search" />
 *   </SearchBar.Fields>
 * </SearchBar.Root>
 */
const SearchBarRoot = <TValues extends FieldValues>({
  defaultValues,
  values,
  onSubmit,
  clearLabel = DEFAULT_CLEAR_LABEL,
  children,
  className
}: ISearchBarRootProps<TValues>) => {
  const form = useForm<TValues>({ defaultValues, values });
  const context = useMemo(() => ({ clearLabel }), [clearLabel]);

  const submit = form.handleSubmit(draft => {
    onSubmit(draft);
  });

  return (
    <SearchBarContext value={context}>
      <FormProvider {...form}>
        <form
          noValidate
          data-slot="search-bar"
          className={cn('flex w-full shrink-0 flex-col gap-4 border-b pb-4', className)}
          onSubmit={event => {
            event.stopPropagation();
            void submit(event);
          }}
          onReset={event => {
            event.preventDefault();
            form.reset(defaultValues);
            void submit();
          }}
        >
          {children}
        </form>
      </FormProvider>
    </SearchBarContext>
  );
};

export default SearchBarRoot;
