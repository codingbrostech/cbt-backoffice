import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import DataTableSearch from '~/table/DataTableSearch';
import type { TSearchValues } from '~/table/search-values';
import type { ISearchField } from '~/types/data-table';

const FIELDS: ISearchField[] = [
  { label: 'admins.code', name: 'code' },
  {
    label: 'admins.state',
    name: 'state',
    inputType: 'select',
    options: [
      { label: 'state.active', value: 'active' },
      { label: 'state.inactive', value: 'inactive' }
    ]
  }
];

const Example = ({ initialValues = {} }: { initialValues?: TSearchValues }) => {
  const [values, setValues] = useState<TSearchValues>(initialValues);

  return (
    <div className="flex flex-col gap-4">
      <DataTableSearch
        fields={FIELDS}
        values={values}
        onSubmit={setValues}
        onReset={() => {
          setValues({});
        }}
      />
      <pre className="rounded-md bg-muted p-3 text-xs">{JSON.stringify(values, null, 2)}</pre>
    </div>
  );
};

const meta = {
  title: 'Table/DataTableSearch',
  component: Example
} satisfies Meta<typeof Example>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Empty: TStory = {};

export const Prefilled: TStory = {
  args: { initialValues: { code: 'admin01', state: 'active' } }
};
