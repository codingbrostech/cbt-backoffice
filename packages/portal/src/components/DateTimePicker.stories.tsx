import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import DateTimePicker, { type TDateTimePickerMode } from '~/components/DateTimePicker';

const Example = ({ mode, initialValue }: { mode: TDateTimePickerMode; initialValue?: string }) => {
  const [value, setValue] = useState<string | null>(initialValue ?? null);

  return (
    <div className="w-72 space-y-2">
      <DateTimePicker mode={mode} value={value} onChange={setValue} />
      <p className="text-muted-foreground text-xs">Value: {value ?? '—'}</p>
    </div>
  );
};

const meta = {
  title: 'Components/DateTimePicker',
  component: Example,
  args: { mode: 'datetime', initialValue: '2026-09-21T09:30:00.000Z' }
} satisfies Meta<typeof Example>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const DateTime: TStory = {};

export const DateOnly: TStory = {
  args: { mode: 'date', initialValue: '2026-09-21' }
};

export const Month: TStory = {
  args: { mode: 'month', initialValue: '2026-09' }
};

export const Empty: TStory = {
  args: { initialValue: undefined }
};
