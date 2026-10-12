import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { LANGUAGE_OPTIONS } from '@cbt-bo/component-lib/lib/header-options.mocks';

import LanguageMenu from '.';

const meta = {
  title: 'Header/LanguageMenu',
  component: LanguageMenu,
  tags: ['!autodocs'],
  args: {
    currentLanguage: 'en',
    options: LANGUAGE_OPTIONS,
    onChange: fn()
  },
  decorators: [
    Story => (
      <div className="flex items-center gap-3 bg-sidebar p-4 text-sidebar-foreground">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof LanguageMenu>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};
