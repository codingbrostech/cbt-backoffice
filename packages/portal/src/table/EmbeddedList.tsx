import type { RowData } from '@tanstack/react-table';

import DataTable from '~/table/DataTable';
import DataTableSearch from '~/table/DataTableSearch';
import type { IListResult } from '~/table/types';
import type { IUseListPageResult } from '~/table/use-list-page';
import type { ISearchField } from '~/types/data-table';

export interface IEmbeddedListProps<TRow extends RowData> {
  page: IUseListPageResult<TRow, object, IListResult<TRow>>;
  fields: ISearchField[];
  /**
   * Controls rendered above the search bar, aligned right.
   */
  actions?: React.ReactNode;
  renderDetail?: (row: TRow) => React.ReactNode;
}

/**
 * Search bar plus table for a list embedded in another page, without the
 * page guard, title or refresh toolbar.
 */
const EmbeddedList = <TRow extends RowData>({
  page,
  fields,
  actions,
  renderDetail
}: IEmbeddedListProps<TRow>) => {
  const {
    table,
    isFetching,
    searchValues,
    defaultSearchValues,
    isError,
    submitSearch,
    resetSearch
  } = page;

  return (
    <div className="flex flex-col gap-3">
      {actions && <div className="flex flex-wrap justify-end gap-2">{actions}</div>}
      {fields.length > 0 && (
        <DataTableSearch
          fields={fields}
          values={searchValues}
          defaultValues={defaultSearchValues}
          onSubmit={submitSearch}
          onReset={resetSearch}
        />
      )}
      <DataTable
        table={table}
        isLoading={isFetching}
        isError={isError}
        renderDetail={renderDetail}
      />
    </div>
  );
};

export default EmbeddedList;
