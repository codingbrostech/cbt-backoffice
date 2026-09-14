import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { children: 'Button' }
} satisfies Meta<typeof Button>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const Outline: TStory = {
  args: { variant: 'outline' }
};

export const Destructive: TStory = {
  args: { variant: 'destructive' }
};
