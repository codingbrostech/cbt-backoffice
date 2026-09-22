import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import Combobox from '~/components/Combobox';
import type { ISelectOption } from '~/table/types';

const OPTIONS: ISelectOption[] = [
  { label: 'Baccarat', value: 'baccarat' },
  { label: 'Roulette', value: 'roulette' },
  { label: 'Sic Bo', value: 'sicbo' },
  { label: 'Slots', value: 'slots' }
];

const SingleExample = ({ isDisabled }: { isDisabled?: boolean }) => {
  const [value, setValue] = useState<string | null>('roulette');

  return (
    <div className="w-72">
      <Combobox
        options={OPTIONS}
        value={value}
        onChange={setValue}
        placeholder="Pick a game"
        isDisabled={isDisabled}
      />
    </div>
  );
};

const MultiExample = () => {
  const [value, setValue] = useState<string[]>(['baccarat', 'slots', 'sicbo']);

  return (
    <div className="w-72">
      <Combobox isMulti options={OPTIONS} value={value} onChange={setValue} placeholder="Games" />
    </div>
  );
};

const meta = {
  title: 'Components/Combobox',
  component: SingleExample
} satisfies Meta<typeof SingleExample>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Single: TStory = {};

export const Disabled: TStory = {
  args: { isDisabled: true }
};

export const Multi: TStory = {
  render: () => <MultiExample />
};
