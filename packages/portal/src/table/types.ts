export interface IListParams {
  page: number;
  pageSize: number;
}

export interface IListResult<TRow> {
  data: TRow[];
  total: number;
}

export interface ISelectOption {
  label: string;
  value: string;
}

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const satisfies readonly number[];
