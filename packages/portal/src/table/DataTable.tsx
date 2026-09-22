import type { RowData } from '@tanstack/react-table';
import { ChevronDownIcon } from 'lucide-react';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingOverlay from '~/components/LoadingOverlay';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table';
import { cn } from '~/lib/utils';
import DataTablePagination from '~/table/DataTablePagination';
import type { TPortalTable } from '~/table/features';

export interface IDataTableProps<TRow extends RowData> {
  table: TPortalTable<TRow>;
  isLoading?: boolean;
  /**
   * The last fetch failed. Shown in place of the empty message.
   */
  isError?: boolean;
  /**
   * Hides the pagination bar for tables that show every row.
   */
  isPaginated?: boolean;
  /**
   * Adds an expand column and renders the result below the expanded row.
   */
  renderDetail?: (row: TRow) => React.ReactNode;
}

interface IExpandedRow<TRow> {
  data: readonly TRow[];
  rowId?: string;
}

const DataTable = <TRow extends RowData>({
  table,
  isLoading = false,
  isError = false,
  isPaginated = true,
  renderDetail
}: IDataTableProps<TRow>) => {
  const { t } = useTranslation();
  const [expandedRow, setExpandedRow] = useState<IExpandedRow<TRow>>({ data: table.options.data });

  const { rows } = table.getRowModel();
  const expandedRowId = expandedRow.data === table.options.data ? expandedRow.rowId : undefined;
  const isSelectable = Boolean(table.options.enableRowSelection);
  const columnCount =
    table.getAllLeafColumns().length + (renderDetail ? 1 : 0) + (isSelectable ? 1 : 0);
  const isAllPageRowsSelected = isSelectable && table.getIsAllPageRowsSelected();
  const isSomePageRowsSelected = isSelectable && table.getIsSomePageRowsSelected();

  const toggleRow = (rowId: string) => {
    setExpandedRow({
      data: table.options.data,
      rowId: expandedRowId === rowId ? undefined : rowId
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {isPaginated && <DataTablePagination table={table} />}
      <div className="relative overflow-x-auto rounded-md border">
        <LoadingOverlay isVisible={isLoading} />
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {isSelectable && (
                  <TableHead className="w-10 text-center">
                    <Checkbox
                      aria-label={t('table.selectAll')}
                      checked={isAllPageRowsSelected || (isSomePageRowsSelected && 'indeterminate')}
                      onCheckedChange={checked => {
                        table.toggleAllPageRowsSelected(checked === true);
                      }}
                    />
                  </TableHead>
                )}
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className="text-center whitespace-nowrap"
                    style={{ width: header.column.columnDef.size }}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
                {renderDetail && (
                  <TableHead className="w-20 text-center whitespace-nowrap">
                    {t('common.detail')}
                  </TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map(row => {
                const isExpanded = row.id === expandedRowId;

                return (
                  <Fragment key={row.id}>
                    <TableRow
                      data-state={isExpanded || row.getIsSelected() ? 'selected' : undefined}
                    >
                      {isSelectable && (
                        <TableCell className="text-center">
                          <Checkbox
                            aria-label={t('table.selectRow')}
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            onCheckedChange={checked => {
                              row.toggleSelected(checked === true);
                            }}
                          />
                        </TableCell>
                      )}
                      {row.getAllCells().map(cell => (
                        <TableCell key={cell.id} className="text-center">
                          <table.FlexRender cell={cell} />
                        </TableCell>
                      ))}
                      {renderDetail && (
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            data-slot="row-expand"
                            aria-expanded={isExpanded}
                            aria-label={t('common.detail')}
                            onClick={() => {
                              toggleRow(row.id);
                            }}
                          >
                            <ChevronDownIcon
                              className={cn('transition-transform', isExpanded && 'rotate-180')}
                            />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                    {renderDetail && isExpanded && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={columnCount} className="p-0">
                          {renderDetail(row.original)}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center text-muted-foreground">
                  {isLoading
                    ? t('table.loading')
                    : t(isError ? 'table.loadFailed' : 'table.noData')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
