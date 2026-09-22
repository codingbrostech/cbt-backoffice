import type { Meta, StoryObj } from '@storybook/react-vite';

import LoadingOverlay from '~/components/LoadingOverlay';

const Example = ({ isVisible }: { isVisible: boolean }) => (
  <div className="relative h-40 w-80 rounded-md border p-4">
    Content behind the overlay
    <LoadingOverlay isVisible={isVisible} />
  </div>
);

const meta = {
  title: 'Components/LoadingOverlay',
  component: Example,
  args: { isVisible: true }
} satisfies Meta<typeof Example>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Visible: TStory = {};

export const Hidden: TStory = {
  args: { isVisible: false }
};
