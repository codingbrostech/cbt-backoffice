import type { RowData } from '@tanstack/react-table';

import ProtectedPage from '~/components/ProtectedPage';
import AppContentTabsToolbar from '~/layouts/AppContentTabsToolbar';
import DataTable from '~/table/DataTable';
import DataTableSearch from '~/table/DataTableSearch';
import type { IListResult } from '~/table/types';
import type { IUseListPageResult } from '~/table/use-list-page';
import type { ISearchField } from '~/types/data-table';

export interface IListPageProps<TRow extends RowData> {
  /**
   * i18n key of the page title.
   */
  title: string;
  page: IUseListPageResult<TRow, object, IListResult<TRow>>;
  fields: ISearchField[];
  /**
   * Controls rendered above the search bar, aligned right.
   */
  actions?: React.ReactNode;
  /**
   * Content between the search bar and the table.
   */
  summary?: React.ReactNode;
  renderDetail?: (row: TRow) => React.ReactNode;
  children?: React.ReactNode;
  segmentIndexFromEnd?: number;
}

/**
 * Standard list page: title guard, actions, search bar, table, refresh
 * toolbar and any dialogs passed as children.
 */
const ListPage = <TRow extends RowData>({
  title,
  page,
  fields,
  actions,
  summary,
  renderDetail,
  children,
  segmentIndexFromEnd
}: IListPageProps<TRow>) => {
  const {
    table,
    isFetching,
    refetch,
    searchValues,
    defaultSearchValues,
    isError,
    submitSearch,
    resetSearch
  } = page;

  return (
    <ProtectedPage title={title} segmentIndexFromEnd={segmentIndexFromEnd}>
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
      {summary}
      <DataTable
        table={table}
        isLoading={isFetching}
        isError={isError}
        renderDetail={renderDetail}
      />
      <AppContentTabsToolbar onRefresh={refetch} />
      {children}
    </ProtectedPage>
  );
};

export default ListPage;
