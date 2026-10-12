import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { expect, userEvent, within } from 'storybook/test';

import SubmitButton, { type ISubmitButtonProps } from '.';

type TSubmitButtonStoryArgs = ISubmitButtonProps & {
  submitDelayMs?: number;
};

const meta = {
  title: 'Forms/SubmitButton',
  component: SubmitButton,
  tags: ['!autodocs'],
  args: {
    label: 'Login',
    disabled: false,
    submitDelayMs: 2000
  },
  argTypes: {
    submitDelayMs: {
      control: 'number',
      description: 'How long the story form takes to submit, in milliseconds'
    }
  },
  parameters: {
    layout: 'centered',
    controls: { exclude: ['control'] }
  },
  render: function Render({ submitDelayMs, ...args }) {
    const { control, handleSubmit } = useForm();

    const submit = () =>
      new Promise<void>(resolve => {
        setTimeout(resolve, submitDelayMs);
      });

    return (
      <form
        onSubmit={event => {
          void handleSubmit(submit)(event);
        }}
      >
        <SubmitButton {...args} control={control} />
      </form>
    );
  }
} satisfies Meta<TSubmitButtonStoryArgs>;

export default meta;

type TStory = StoryObj<TSubmitButtonStoryArgs>;

export const Default: TStory = {};

export const Submitting: TStory = {
  args: { submitDelayMs: 60_000 },
  parameters: { docs: { story: { autoplay: true } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Login' });

    await userEvent.click(button);

    await expect(await canvas.findByRole('status')).toBeInTheDocument();
    await expect(button).toBeDisabled();
  }
};

export const Disabled: TStory = {
  args: { disabled: true }
};
