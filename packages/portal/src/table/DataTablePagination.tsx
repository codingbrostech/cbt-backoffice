import type { RowData } from '@tanstack/react-table';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import type { TPortalTable } from '~/table/features';
import { PAGE_SIZE_OPTIONS } from '~/table/types';

export interface IDataTablePaginationProps<TRow extends RowData> {
  table: TPortalTable<TRow>;
}

const DataTablePagination = <TRow extends RowData>({ table }: IDataTablePaginationProps<TRow>) => {
  const { t } = useTranslation();

  const { pageIndex, pageSize } = table.state.pagination;
  const pageCount = Math.max(table.getPageCount(), 1);
  const total = table.getRowCount();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <div className="text-muted-foreground">{t('table.total', { count: total })}</div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{t('table.rowsPerPage')}</span>
          <Select
            value={String(pageSize)}
            onValueChange={value => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger size="sm" className="w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZE_OPTIONS.map(option => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-muted-foreground tabular-nums">
          {t('table.pageOf', { page: pageIndex + 1, pageCount })}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t('table.firstPage')}
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.firstPage();
            }}
          >
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t('table.previousPage')}
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.previousPage();
            }}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t('table.nextPage')}
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.nextPage();
            }}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t('table.lastPage')}
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.lastPage();
            }}
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTablePagination;
