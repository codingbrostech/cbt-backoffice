import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import DataTable from '~/table/DataTable';
import { buildColumnDefs } from '~/table/build-column-defs';
import type { IListParams } from '~/table/types';
import { useListTable } from '~/table/use-list-table';
import { useStaticTable } from '~/table/use-static-table';

interface IAdminRow {
  name: string;
  code: string;
  state: string;
  balance: number;
}

const ROWS: IAdminRow[] = Array.from({ length: 23 }, (_, index) => ({
  name: `Admin ${index + 1}`,
  code: `admin${String(index + 1).padStart(2, '0')}`,
  state: index % 5 === 0 ? 'inactive' : 'active',
  balance: (index + 1) * 12345
}));

const columns = buildColumnDefs<IAdminRow>({
  modelName: 'admins',
  columnsOrder: ['name', 'code', 'state', 'balance'],
  fieldOptions: {
    state: { formatterType: 'map' },
    balance: { formatterType: 'currency', translateKey: 'operationalStats.income' }
  }
});

const PaginatedExample = ({ isLoading = false }: { isLoading?: boolean }) => {
  const [params, setParams] = useState<IListParams>({ page: 1, pageSize: 10 });

  const start = (params.page - 1) * params.pageSize;
  const data = ROWS.slice(start, start + params.pageSize);
  const table = useListTable({
    columns,
    data,
    total: ROWS.length,
    params,
    onParamsChange: setParams
  });

  return <DataTable table={table} isLoading={isLoading} />;
};

const StaticExample = () => {
  const table = useStaticTable({ columns, data: ROWS.slice(0, 4) });

  return <DataTable table={table} isPaginated={false} />;
};

const EmptyExample = () => {
  const table = useStaticTable({ columns, data: [] });

  return <DataTable table={table} isPaginated={false} />;
};

const meta = {
  title: 'Table/DataTable',
  component: PaginatedExample
} satisfies Meta<typeof PaginatedExample>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Paginated: TStory = {};

export const Loading: TStory = {
  args: { isLoading: true }
};

export const Static: TStory = {
  render: () => <StaticExample />
};

export const Empty: TStory = {
  render: () => <EmptyExample />
};
