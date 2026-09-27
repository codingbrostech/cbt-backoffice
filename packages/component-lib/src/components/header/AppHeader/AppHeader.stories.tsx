import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from '@cbt-bo/component-lib/lib/header-options.mocks';

import AppHeader from '.';

const meta = {
  title: 'Header/AppHeader',
  component: AppHeader,
  tags: ['!autodocs'],
  args: {
    start: 'Backoffice',
    version: 'dev-0.0.7',
    isTimeVisible: true,
    isTimezoneSelectable: true,
    timezoneMinutes: 480,
    timezoneOptions: TIMEZONE_OPTIONS,
    onTimezoneChange: fn(),
    currentLanguage: 'en',
    languageOptions: LANGUAGE_OPTIONS,
    onLanguageChange: fn(),
    theme: 'light',
    onThemeChange: fn(),
    themeLightLabel: 'Switch to light mode',
    themeDarkLabel: 'Switch to dark mode',
    userName: 'admin',
    userRole: 'super-admin',
    logoutLabel: 'Logout',
    onLogout: fn()
  },
  argTypes: {
    isTimeVisible: {
      control: 'boolean',
      description: 'Shows the clock, version and timezone select cluster'
    },
    isTimezoneSelectable: {
      control: 'boolean',
      description: 'Shows the timezone select. Off, the clock stays on `timezoneMinutes`',
      if: { arg: 'isTimeVisible' }
    },
    theme: {
      control: 'radio',
      options: ['light', 'dark'],
      description: 'Shows the moon icon in light mode and the sun icon in dark mode'
    }
  },
  parameters: { layout: 'fullscreen' },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    const handleThemeChange = (theme: 'light' | 'dark') => {
      updateArgs({ theme });
      args.onThemeChange(theme);
    };

    if (args.isTimeVisible === false || args.isTimezoneSelectable === false) {
      return <AppHeader {...args} onThemeChange={handleThemeChange} />;
    }

    const handleTimezoneChange = (timezoneMinutes: number) => {
      updateArgs({ timezoneMinutes });
      args.onTimezoneChange(timezoneMinutes);
    };

    return (
      <AppHeader
        {...args}
        onTimezoneChange={handleTimezoneChange}
        onThemeChange={handleThemeChange}
      />
    );
  }
} satisfies Meta<typeof AppHeader>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const FixedTimezone: TStory = {
  args: { isTimezoneSelectable: false }
};

export const WithoutTime: TStory = {
  args: { isTimeVisible: false }
};
