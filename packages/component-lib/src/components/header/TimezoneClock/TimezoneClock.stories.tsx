import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import { TIMEZONE_OPTIONS } from '@cbt-bo/component-lib/lib/header-options.mocks';

import TimezoneClock from '.';

const meta = {
  title: 'Header/TimezoneClock',
  component: TimezoneClock,
  tags: ['!autodocs'],
  args: {
    timezoneMinutes: 480,
    options: TIMEZONE_OPTIONS,
    onTimezoneChange: fn(),
    isTimezoneSelectable: true,
    version: 'dev-0.0.7'
  },
  argTypes: {
    timezoneMinutes: {
      control: 'select',
      options: TIMEZONE_OPTIONS.map(option => option.value),
      description: 'UTC offset in minutes applied to the displayed time'
    },
    isTimezoneSelectable: {
      control: 'boolean',
      description: 'Shows the timezone select. Off, the clock stays on `timezoneMinutes`'
    },
    version: {
      control: 'text',
      description: 'Shown under the time when set'
    }
  },
  decorators: [
    (Story: () => ReactElement) => (
      <div className="flex items-center gap-3 bg-sidebar p-4 text-sidebar-foreground">
        <Story />
      </div>
    )
  ],
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    if (args.isTimezoneSelectable === false) {
      return <TimezoneClock {...args} />;
    }

    const handleTimezoneChange = (timezoneMinutes: number) => {
      updateArgs({ timezoneMinutes });
      args.onTimezoneChange(timezoneMinutes);
    };

    return <TimezoneClock {...args} onTimezoneChange={handleTimezoneChange} />;
  }
} satisfies Meta<typeof TimezoneClock>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const FixedTimezone: TStory = {
  args: { isTimezoneSelectable: false }
};

export const WithoutVersion: TStory = {
  args: { version: undefined }
};
