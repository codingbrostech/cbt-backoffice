import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { TooltipProvider } from '@cbt-bo/component-lib/components/ui/tooltip';

import TruncatedText from '.';

const meta = {
  title: 'Table/TruncatedText',
  component: TruncatedText,
  args: {
    text: 'ECHO FORTUNES - JIN JI BAO XI'
  },
  render: args => (
    <TooltipProvider>
      <div className="w-40 text-sm">
        <TruncatedText {...args} />
      </div>
    </TooltipProvider>
  )
} satisfies Meta<typeof TruncatedText>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Truncated: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.hover(canvas.getByText('ECHO FORTUNES - JIN JI BAO XI'));

    await expect(await body.findByRole('tooltip')).toHaveTextContent(
      'ECHO FORTUNES - JIN JI BAO XI'
    );
  }
};

export const Fitting: TStory = {
  args: {
    text: 'DRAGON TRIO'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.hover(canvas.getByText('DRAGON TRIO'));

    await expect(body.queryByRole('tooltip')).not.toBeInTheDocument();
  }
};
