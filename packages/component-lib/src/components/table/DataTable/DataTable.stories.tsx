import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import DataTable, { type TDataTableLabels } from '.';
import {
  DEFAULT_PAGE_SIZE,
  type IDataTableColumn,
  type IListParams,
  type TColumnVisibility
} from './list-table';

interface IAdminRow {
  id: string;
  code: string;
  name: string;
  role: string;
  state: string;
}

interface IStoryArgs {
  rows: IAdminRow[];
  isLoading: boolean;
  isError: boolean;
  isPaginated: boolean;
  labels: TDataTableLabels;
}

const LABELS = {
  noData: 'No records',
  loading: 'Loading',
  loadFailed: 'Failed to load records',
  firstPage: 'First page',
  previousPage: 'Previous page',
  previous: 'Previous',
  nextPage: 'Next page',
  next: 'Next',
  lastPage: 'Last page',
  page: 'Page',
  go: 'Go',
  rowsPerPage: 'Rows per page',
  columns: 'Columns',
  formatRange: (from, to, total) => `Showing ${from}-${to} out of ${total}`
} as const satisfies TDataTableLabels;

const ROLES = ['super', 'admin', 'ops'];
const STATES = ['active', 'inactive'];
const ROWS: IAdminRow[] = Array.from({ length: 23 }, (_, index) => ({
  id: String(index + 1),
  code: `admin${String(index + 1).padStart(2, '0')}`,
  name: `Admin ${index + 1}`,
  role: ROLES[index % ROLES.length] ?? 'admin',
  state: STATES[index % STATES.length] ?? 'active'
}));
const EMPTY_ROWS: IAdminRow[] = [];

const COLUMNS: IDataTableColumn<IAdminRow>[] = [
  { key: 'code', title: 'Login', width: 160, fixed: 'start', render: ({ code }) => code },
  { key: 'name', title: 'Name', render: ({ name }) => name },
  { key: 'role', title: 'Role', width: 140, render: ({ role }) => role },
  { key: 'state', title: 'State', width: 120, render: ({ state }) => state }
];

const Render = ({ rows, isLoading, isError, isPaginated, labels }: IStoryArgs) => {
  const [params, setParams] = useState<IListParams>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [columnVisibility, setColumnVisibility] = useState<TColumnVisibility>({});

  const data = useMemo(() => {
    const start = (params.page - 1) * params.pageSize;

    return rows.slice(start, start + params.pageSize);
  }, [rows, params]);

  return (
    <DataTable.Root
      columns={COLUMNS}
      data={data}
      total={rows.length}
      labels={labels}
      params={params}
      onParamsChange={setParams}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={setColumnVisibility}
      isLoading={isLoading}
      isError={isError}
    >
      <DataTable.Toolbar className="justify-end">
        <DataTable.ColumnToggle />
      </DataTable.Toolbar>
      <DataTable.Grid />
      {isPaginated && <DataTable.Pagination />}
    </DataTable.Root>
  );
};

const meta = {
  title: 'Table/DataTable',
  tags: ['!autodocs'],
  args: {
    rows: ROWS,
    isLoading: false,
    isError: false,
    isPaginated: true,
    labels: LABELS
  },
  render: Render
} satisfies Meta<IStoryArgs>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  parameters: { docs: { story: { autoplay: true } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('admin01')).toBeVisible();
    await expect(canvas.getByRole('link', { name: '1', current: 'page' })).toBeVisible();

    await userEvent.click(canvas.getByRole('link', { name: 'Next page' }));

    await expect(await canvas.findByText('admin11')).toBeVisible();
    await expect(canvas.getByRole('link', { name: '2', current: 'page' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
    await userEvent.click(await screen.findByRole('menuitemcheckbox', { name: 'Role' }));
    await userEvent.keyboard('{Escape}');

    await expect(canvas.queryByRole('columnheader', { name: 'Role' })).not.toBeInTheDocument();
  }
};

export const Empty: TStory = {
  args: { rows: EMPTY_ROWS }
};

export const Loading: TStory = {
  args: { isLoading: true }
};

export const LoadFailed: TStory = {
  args: { rows: EMPTY_ROWS, isError: true }
};

export const Unpaginated: TStory = {
  args: { rows: ROWS.slice(0, 5), isPaginated: false }
};

export const FixedColumnWhenScrolling: TStory = {
  decorators: [
    Story => (
      <div className="w-[420px]">
        <Story />
      </div>
    )
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cell = await canvas.findByText('admin01');

    await waitFor(() => expect(cell.closest('td')).toHaveStyle({ position: 'sticky' }));
  }
};

export const NotFixedWhenFits: TStory = {
  decorators: [
    Story => (
      <div className="w-[900px]">
        <Story />
      </div>
    )
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cell = await canvas.findByText('admin01');

    await waitFor(() => expect(cell.closest('td')).not.toHaveStyle({ position: 'sticky' }));
  }
};
