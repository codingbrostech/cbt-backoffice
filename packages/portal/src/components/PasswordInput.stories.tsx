import type { Meta, StoryObj } from '@storybook/react-vite';

import PasswordInput from '~/components/PasswordInput';

const meta = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  args: { defaultValue: 'secret', 'aria-label': 'Password' }
} satisfies Meta<typeof PasswordInput>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const Disabled: TStory = {
  args: { disabled: true }
};
