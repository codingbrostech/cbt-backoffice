import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkles } from 'lucide-react';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import BrandLogo from '@cbt-bo/component-lib/components/header/BrandLogo';
import type { IBrandLogoProps } from '@cbt-bo/component-lib/components/header/BrandLogo';
import LanguageMenu from '@cbt-bo/component-lib/components/header/LanguageMenu';
import type { ILanguageMenuProps } from '@cbt-bo/component-lib/components/header/LanguageMenu';
import ThemeToggle from '@cbt-bo/component-lib/components/header/ThemeToggle';
import type {
  IThemeToggleProps,
  TTheme
} from '@cbt-bo/component-lib/components/header/ThemeToggle';
import TimezoneClock from '@cbt-bo/component-lib/components/header/TimezoneClock';
import UserMenu from '@cbt-bo/component-lib/components/header/UserMenu';
import type { IUserMenuProps } from '@cbt-bo/component-lib/components/header/UserMenu';
import { SidebarProvider } from '@cbt-bo/component-lib/components/ui/sidebar';
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from '@cbt-bo/component-lib/lib/header-options.mocks';

import AppHeader from '.';
import type { IAppHeaderRootProps } from '.';

type TStoryArgs = IAppHeaderRootProps &
  Pick<IBrandLogoProps, 'brandName'> &
  Pick<IThemeToggleProps, 'theme' | 'onThemeChange'> &
  Pick<ILanguageMenuProps, 'currentLanguage'> &
  Pick<IUserMenuProps, 'userName' | 'userRole' | 'onLogout'> & {
    isClockVisible: boolean;
    timezoneMinutes: number;
    isTimezoneSelectable: boolean;
    version?: string;
    onTimezoneChange: (timezoneMinutes: number) => void;
    onLanguageChange: (language: string) => void;
  };

interface IControlsGroup {
  group: string;
  include: readonly (keyof TStoryArgs)[];
}

/**
 * The args grouped by the component that takes them.
 */
export const CONTROL_GROUPS = [
  { group: 'Root', include: ['className'] },
  { group: 'BrandLogo', include: ['brandName'] },
  {
    group: 'TimezoneClock',
    include: [
      'isClockVisible',
      'timezoneMinutes',
      'isTimezoneSelectable',
      'version',
      'onTimezoneChange'
    ]
  },
  { group: 'ThemeToggle', include: ['theme', 'onThemeChange'] },
  { group: 'LanguageMenu', include: ['currentLanguage', 'onLanguageChange'] },
  { group: 'UserMenu', include: ['userName', 'userRole', 'onLogout'] }
] as const satisfies readonly IControlsGroup[];

const meta = {
  title: 'Header/AppHeader',
  component: AppHeader.Root,
  tags: ['!autodocs'],
  excludeStories: ['CONTROL_GROUPS'],
  args: {
    children: null,
    brandName: 'Backoffice',
    isClockVisible: true,
    timezoneMinutes: 480,
    isTimezoneSelectable: true,
    version: 'dev-0.0.7',
    onTimezoneChange: fn(),
    theme: 'light',
    onThemeChange: fn(),
    currentLanguage: 'en',
    onLanguageChange: fn(),
    userName: 'admin',
    userRole: 'super-admin',
    onLogout: fn()
  },
  argTypes: {
    className: {
      description: 'Classes on `Root`.',
      table: { category: 'Root' }
    },
    children: { table: { disable: true } },
    isClockVisible: {
      type: { name: 'boolean' },
      description: 'Renders `TimezoneClock` and its `Separator` in `End`.',
      table: { category: 'TimezoneClock' }
    },
    brandName: {
      type: { name: 'string', required: true },
      description: 'Name shown by `BrandLogo` in `Start` while the sidebar rail is expanded.',
      table: { category: 'BrandLogo' }
    },
    timezoneMinutes: {
      type: { name: 'number', required: true },
      control: 'select',
      options: TIMEZONE_OPTIONS.map(option => option.value),
      description: 'UTC offset in minutes shown by `TimezoneClock`.',
      table: { category: 'TimezoneClock' }
    },
    isTimezoneSelectable: {
      type: { name: 'boolean' },
      description: 'Shows the timezone select beside the clock.',
      table: { category: 'TimezoneClock' }
    },
    version: {
      type: { name: 'string' },
      description: 'Shown under the time when set.',
      table: { category: 'TimezoneClock' }
    },
    onTimezoneChange: {
      type: { name: 'function' },
      description: 'Called with the picked offset.',
      table: { category: 'TimezoneClock' }
    },
    theme: {
      type: { name: 'string', required: true },
      control: 'radio',
      options: ['light', 'dark'],
      description: 'Current theme of `ThemeToggle`.',
      table: { category: 'ThemeToggle' }
    },
    onThemeChange: {
      type: { name: 'function' },
      description: 'Called with the next theme.',
      table: { category: 'ThemeToggle' }
    },
    currentLanguage: {
      type: { name: 'string', required: true },
      control: 'select',
      options: LANGUAGE_OPTIONS.map(option => option.value),
      description: 'Value of the selected `LanguageMenu` option.',
      table: { category: 'LanguageMenu' }
    },
    onLanguageChange: {
      type: { name: 'function' },
      description: 'Called with the picked language.',
      table: { category: 'LanguageMenu' }
    },
    userName: {
      type: { name: 'string', required: true },
      description: 'Name shown in `UserMenu`.',
      table: { category: 'UserMenu' }
    },
    userRole: {
      type: { name: 'string' },
      description: 'Role shown beside the name in `UserMenu`.',
      table: { category: 'UserMenu' }
    },
    onLogout: {
      type: { name: 'function' },
      description: 'Called when the logout item is clicked.',
      table: { category: 'UserMenu' }
    }
  },
  parameters: { layout: 'fullscreen' },
  render: function Render({
    brandName,
    isClockVisible,
    timezoneMinutes,
    isTimezoneSelectable,
    version,
    onTimezoneChange,
    theme,
    onThemeChange,
    currentLanguage,
    onLanguageChange,
    userName,
    userRole,
    onLogout,
    ...args
  }) {
    const [, updateArgs] = useArgs();

    const handleTimezoneChange = (picked: number) => {
      updateArgs({ timezoneMinutes: picked });
      onTimezoneChange(picked);
    };

    const handleThemeChange = (picked: TTheme) => {
      updateArgs({ theme: picked });
      onThemeChange(picked);
    };

    const handleLanguageChange = (picked: string) => {
      updateArgs({ currentLanguage: picked });
      onLanguageChange(picked);
    };

    return (
      <SidebarProvider className="min-h-0 flex-col">
        <AppHeader.Root {...args}>
          <AppHeader.Start>
            <BrandLogo icon={<Sparkles className="size-5" />} brandName={brandName} />
          </AppHeader.Start>
          <AppHeader.End>
            {isClockVisible && (
              <>
                {isTimezoneSelectable ? (
                  <TimezoneClock
                    timezoneMinutes={timezoneMinutes}
                    options={TIMEZONE_OPTIONS}
                    onTimezoneChange={handleTimezoneChange}
                    version={version}
                  />
                ) : (
                  <TimezoneClock
                    timezoneMinutes={timezoneMinutes}
                    isTimezoneSelectable={false}
                    version={version}
                  />
                )}
                <AppHeader.Separator />
              </>
            )}
            <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
            <LanguageMenu
              currentLanguage={currentLanguage}
              options={LANGUAGE_OPTIONS}
              onChange={handleLanguageChange}
            />
            <AppHeader.Separator />
            <UserMenu
              userName={userName}
              userRole={userRole}
              logoutLabel="Logout"
              onLogout={onLogout}
            />
          </AppHeader.End>
        </AppHeader.Root>
      </SidebarProvider>
    );
  }
} satisfies Meta<TStoryArgs>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const FixedTimezone: TStory = {
  args: { isTimezoneSelectable: false }
};

export const WithoutClock: TStory = {
  args: { isClockVisible: false }
};
