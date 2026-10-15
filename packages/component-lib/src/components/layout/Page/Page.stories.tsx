import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';

import { SearchBar } from '@cbt-bo/component-lib/components/search';
import {
  DEFAULT_PAGE_SIZE,
  DataTable,
  type IDataTableColumn,
  type IListParams,
  type TColumnPinning,
  type TDataTableLabels
} from '@cbt-bo/component-lib/components/table';

import Page from '.';

interface IBetRow {
  id: string;
  player: string;
  amount: string;
  state: string;
  time: string;
  provider: string;
  game: string;
  round: string;
}

interface IFilterValues {
  playerId: string;
  roundId: string;
}

interface IStoryArgs {
  isPageScroll: boolean;
  className?: string;
  onSubmit: (values: IFilterValues) => void;
}

const DEFAULT_FILTER: IFilterValues = { playerId: '', roundId: '' };

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
  columnMenu: 'Column menu',
  pinColumn: 'Pin Column',
  noPin: 'No Pin',
  pinLeft: 'Pin Left',
  pinRight: 'Pin Right',
  formatRange: (from, to, total) => `Showing ${from}-${to} out of ${total}`
} as const satisfies TDataTableLabels;

const STATES = ['Settled', 'Unsettled', 'Cancelled'];
const ROWS: IBetRow[] = Array.from({ length: 30 }, (_, index) => ({
  id: String(index + 1),
  player: String(200_000 + index),
  amount: `${(index + 1) * 1_000}.00`,
  state: STATES[index % STATES.length] ?? 'Settled',
  time: `2026-10-15 14:${String(index).padStart(2, '0')}:00`,
  provider: index % 2 ? 'itam' : 'st8',
  game: index % 2 ? 'Baccarat S4' : 'Fortune Gems',
  round: String(15_000_000 + index)
}));

const COLUMNS: IDataTableColumn<IBetRow>[] = [
  { key: 'player', title: 'Player', width: 180, fixed: 'start', render: ({ player }) => player },
  { key: 'amount', title: 'Amount', width: 180, render: ({ amount }) => amount },
  { key: 'state', title: 'State', width: 180, render: ({ state }) => state },
  { key: 'time', title: 'Time', width: 220, render: ({ time }) => time },
  { key: 'provider', title: 'Provider', width: 180, render: ({ provider }) => provider },
  { key: 'game', title: 'Game', width: 220, render: ({ game }) => game },
  { key: 'round', title: 'Round ID', width: 180, render: ({ round }) => round }
];

const Render = ({ isPageScroll, className, onSubmit }: IStoryArgs) => {
  const [params, setParams] = useState<IListParams>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [columnPinning, setColumnPinning] = useState<TColumnPinning>({});

  const start = (params.page - 1) * params.pageSize;
  const data = ROWS.slice(start, start + params.pageSize);

  return (
    <Page.Root isPageScroll={isPageScroll} className={className}>
      <Page.Header>
        <SearchBar.Root defaultValues={DEFAULT_FILTER} onSubmit={onSubmit}>
          <SearchBar.Header title="Bet Trans" />
          <SearchBar.Fields>
            <SearchBar.TextField name="playerId" label="Player ID" />
            <SearchBar.TextField name="roundId" label="Round ID" />
            <SearchBar.Actions resetLabel="Reset" submitLabel="Search" />
          </SearchBar.Fields>
        </SearchBar.Root>
      </Page.Header>
      <DataTable.Root
        columns={COLUMNS}
        data={data}
        total={ROWS.length}
        labels={LABELS}
        params={params}
        onParamsChange={setParams}
        columnPinning={columnPinning}
        onColumnPinningChange={setColumnPinning}
        isPageScroll={isPageScroll}
      >
        <DataTable.Grid />
        <DataTable.Pagination />
      </DataTable.Root>
    </Page.Root>
  );
};

const findContentArea = (canvasElement: HTMLElement): HTMLElement => {
  const content = canvasElement.querySelector('[data-slot="page"]')?.parentElement;
  if (!content) throw new Error('The content area is missing');

  return content;
};

const meta = {
  title: 'Layout/Page',
  tags: ['!autodocs'],
  args: {
    isPageScroll: false,
    onSubmit: fn()
  },
  argTypes: {
    isPageScroll: {
      description:
        'Sizes the page to its content so the content area scrolls both ways. Pass the same flag to `DataTable.Root`. Defaults to false.',
      table: { category: 'Root' }
    },
    className: {
      description: 'Classes on `Root`.',
      table: { category: 'Root' }
    },
    onSubmit: { table: { disable: true } }
  },
  decorators: [
    Story => (
      <div className="@container relative flex h-[420px] w-[720px] flex-col overflow-auto overscroll-x-none rounded-sm border border-border bg-card px-5 pb-2 [scrollbar-gutter:stable] before:block before:h-6 before:shrink-0 before:content-['']">
        <Story />
      </div>
    )
  ],
  render: Render
} satisfies Meta<IStoryArgs>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const GridScroll: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = findContentArea(canvasElement);

    const header = (await canvas.findByText('Bet Trans')).closest('[data-slot="page-header"]');

    await expect(header).not.toHaveStyle({ position: 'sticky' });
    await waitFor(async () => {
      await expect(content.scrollHeight).toBe(content.clientHeight);
      await expect(content.scrollWidth).toBe(content.clientWidth);
    });
  }
};

export const PageScroll: TStory = {
  args: { isPageScroll: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = findContentArea(canvasElement);

    const header = (await canvas.findByText('Bet Trans')).closest('[data-slot="page-header"]');

    await expect(header).toHaveStyle({ position: 'sticky' });
    await waitFor(async () => {
      await expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);
      await expect(content.scrollWidth).toBeGreaterThan(content.clientWidth);
    });
  }
};
