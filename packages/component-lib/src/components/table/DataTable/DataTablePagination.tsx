import { useState } from 'react';

import { buildPaginationRange } from '@cbt-bo/component-lib/components/table/DataTable/build-pagination-range';
import { useDataTable } from '@cbt-bo/component-lib/components/table/DataTable/data-table-context';
import {
  PAGE_SIZE_OPTIONS,
  buildPageCount
} from '@cbt-bo/component-lib/components/table/DataTable/list-table';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { Input } from '@cbt-bo/component-lib/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@cbt-bo/component-lib/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@cbt-bo/component-lib/components/ui/select';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IDataTablePaginationLabels {
  firstPage: string;
  previousPage: string;
  previous: string;
  nextPage: string;
  next: string;
  lastPage: string;
  page: string;
  go: string;
  rowsPerPage: string;
  formatRange: (from: number, to: number, total: number) => string;
}

const DISABLED_LINK_CLASS = 'pointer-events-none opacity-50';

/**
 * Pagination bar of a server-paginated list, exposed as `DataTable.Pagination`.
 * Reports every page or page size change through the root's `onParamsChange`.
 */
const DataTablePagination = () => {
  const { labels, params, total, onParamsChange } = useDataTable();
  const { page, pageSize } = params;
  const [pageInput, setPageInput] = useState(String(page));
  const [prevPage, setPrevPage] = useState(page);

  if (page !== prevPage) {
    setPrevPage(page);
    setPageInput(String(page));
  }

  const pageCount = buildPageCount(total, pageSize);
  const pageItems = buildPaginationRange(page, pageCount);
  const isPreviousAllowed = page > 1;
  const isNextAllowed = page < pageCount;
  const isMultiPage = pageCount > 1;
  const rangeFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeTo = Math.min(page * pageSize, total);

  const goToPage = (target: number) => {
    const next = Math.min(pageCount, Math.max(1, target));
    if (next === page) return;

    onParamsChange({ page: next, pageSize });
  };

  const submitPageInput = () => {
    const target = Number.parseInt(pageInput, 10);
    if (Number.isNaN(target)) {
      setPageInput(String(page));
      return;
    }

    goToPage(target);
  };

  return (
    <div className="grid w-full shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-t pt-3 text-sm">
      <div className="min-w-0 truncate text-muted-foreground">
        {labels.formatRange(rangeFrom, rangeTo, total)}
      </div>
      <div className="flex min-w-0 items-center justify-center gap-3">
        <Pagination className="mx-0 w-auto justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst
                href="#"
                aria-label={labels.firstPage}
                aria-disabled={!isPreviousAllowed}
                className={cn(!isPreviousAllowed && DISABLED_LINK_CLASS)}
                onClick={event => {
                  event.preventDefault();
                  goToPage(1);
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text={labels.previous}
                aria-label={labels.previousPage}
                aria-disabled={!isPreviousAllowed}
                className={cn(!isPreviousAllowed && DISABLED_LINK_CLASS)}
                onClick={event => {
                  event.preventDefault();
                  goToPage(page - 1);
                }}
              />
            </PaginationItem>
            {pageItems.map((item, index) =>
              item === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    isActive={item === page}
                    onClick={event => {
                      event.preventDefault();
                      goToPage(item);
                    }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                text={labels.next}
                aria-label={labels.nextPage}
                aria-disabled={!isNextAllowed}
                className={cn(!isNextAllowed && DISABLED_LINK_CLASS)}
                onClick={event => {
                  event.preventDefault();
                  goToPage(page + 1);
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast
                href="#"
                aria-label={labels.lastPage}
                aria-disabled={!isNextAllowed}
                className={cn(!isNextAllowed && DISABLED_LINK_CLASS)}
                onClick={event => {
                  event.preventDefault();
                  goToPage(pageCount);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        {isMultiPage && (
          <form
            className="hidden shrink-0 items-center gap-2 md:flex"
            onSubmit={event => {
              event.preventDefault();
              submitPageInput();
            }}
          >
            <span className="shrink-0 text-muted-foreground">{labels.page}</span>
            <Input
              type="number"
              min={1}
              max={pageCount}
              value={pageInput}
              aria-label={labels.page}
              className="h-8 w-14 shrink-0 px-2 text-center"
              onChange={event => {
                setPageInput(event.target.value);
              }}
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="h-8 shrink-0 rounded-sm px-2 text-sm"
            >
              {labels.go}
            </Button>
          </form>
        )}
      </div>
      <div className="flex min-w-0 items-center justify-end gap-2">
        <span className="shrink-0 text-muted-foreground">{labels.rowsPerPage}</span>
        <Select
          value={String(pageSize)}
          onValueChange={value => {
            onParamsChange({ page: 1, pageSize: Number(value) });
          }}
        >
          <SelectTrigger size="sm" className="w-18 shrink-0" aria-label={labels.rowsPerPage}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top" className="min-w-18">
            {PAGE_SIZE_OPTIONS.map(option => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DataTablePagination;
