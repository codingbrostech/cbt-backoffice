import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import EditableSelect from '~/components/EditableSelect';
import type { ISelectOption } from '~/table/types';

const OPTIONS: ISelectOption[] = [
  { label: 'Evolution', value: 'evo' },
  { label: 'Pragmatic Play', value: 'pp' },
  { label: 'SA Gaming', value: 'sa' }
];

const Example = ({
  isEditing,
  isInvalid,
  isChanged
}: {
  isEditing: boolean;
  isInvalid?: boolean;
  isChanged?: boolean;
}) => {
  const [value, setValue] = useState('pp');

  return (
    <div className="w-72">
      <EditableSelect
        id="provider"
        label="Provider"
        options={OPTIONS}
        value={value}
        onChange={setValue}
        isEditing={isEditing}
        isInvalid={isInvalid}
        isChanged={isChanged}
      />
    </div>
  );
};

const meta = {
  title: 'Components/EditableSelect',
  component: Example,
  args: { isEditing: true }
} satisfies Meta<typeof Example>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Editing: TStory = {};

export const ReadOnly: TStory = {
  args: { isEditing: false }
};

export const Changed: TStory = {
  args: { isChanged: true }
};

export const Invalid: TStory = {
  args: { isInvalid: true }
};
