import { arrayMove } from '@dnd-kit/sortable';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent, within } from 'storybook/test';

import HeaderTabs from '.';

const meta = {
  title: 'Layout/HeaderTabs',
  component: HeaderTabs,
  tags: ['!autodocs'],
  args: {
    tabs: [
      { key: '/dashboard', label: 'Dashboard' },
      { key: '/players', label: 'Players' },
      { key: '/reports', label: 'Reports' }
    ],
    activeKey: '/players',
    onSelect: fn(),
    onClose: fn(),
    onCloseOthers: fn(),
    onMove: fn(),
    isDraggable: true,
    closeTabLabel: 'Close tab',
    tabActionsLabel: 'Tab actions',
    closeSelectedTabLabel: 'Close selected tab',
    closeOtherTabsLabel: 'Close other tabs',
    scrollLeftLabel: 'Scroll tabs left',
    scrollRightLabel: 'Scroll tabs right'
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    const handleSelect = (key: string) => {
      updateArgs({ activeKey: key });
      args.onSelect(key);
    };

    const handleClose = (key: string) => {
      updateArgs({ tabs: args.tabs.filter(tab => tab.key !== key) });
      args.onClose(key);
    };

    const handleCloseOthers = (key: string) => {
      updateArgs({ tabs: args.tabs.filter(tab => tab.key === key) });
      args.onCloseOthers(key);
    };

    const handleMove = (key: string, targetKey: string) => {
      const keys = args.tabs.map(tab => tab.key);
      updateArgs({ tabs: arrayMove(args.tabs, keys.indexOf(key), keys.indexOf(targetKey)) });
      args.onMove(key, targetKey);
    };

    return (
      <HeaderTabs
        {...args}
        onSelect={handleSelect}
        onClose={handleClose}
        onCloseOthers={handleCloseOthers}
        onMove={handleMove}
      />
    );
  }
} satisfies Meta<typeof HeaderTabs>;

export default meta;

type TStory = StoryObj<typeof meta>;

const dragTab = async (
  canvasElement: HTMLElement,
  fromName: string,
  toName: string
): Promise<void> => {
  const canvas = within(canvasElement);
  const fromTab = canvas.getByRole('tab', { name: fromName });
  const toTab = canvas.getByRole('tab', { name: toName });
  const fromRect = fromTab.getBoundingClientRect();
  const toRect = toTab.getBoundingClientRect();
  const start = { x: fromRect.x + fromRect.width / 2, y: fromRect.y + fromRect.height / 2 };
  const end = { x: toRect.x + toRect.width / 2, y: start.y };

  await userEvent.pointer([
    { keys: '[MouseLeft>]', target: fromTab, coords: start },
    { coords: { x: start.x + 10, y: start.y } },
    { coords: { x: end.x - 10, y: end.y } },
    { coords: end },
    { keys: '[/MouseLeft]' }
  ]);
};

export const Default: TStory = {};

export const SingleTab: TStory = {
  args: {
    tabs: [{ key: '/dashboard', label: 'Dashboard' }],
    activeKey: '/dashboard'
  }
};

export const Overflowing: TStory = {
  args: {
    tabs: [
      { key: '/dashboard', label: 'Dashboard' },
      { key: '/players', label: 'Players' },
      { key: '/player-sessions', label: 'Player Sessions' },
      { key: '/player-mobile-policy', label: 'Player Mobile Policy' },
      { key: '/player-self-limits', label: 'Player Self Limits' },
      { key: '/player-labels', label: 'Player Labels' },
      { key: '/player-groups', label: 'Player Groups' },
      { key: '/vip-levels', label: 'VIP Levels' },
      { key: '/reports', label: 'Reports' },
      { key: '/bet-trans', label: 'Bet Trans' },
      { key: '/ledger-trans', label: 'Ledger Trans' },
      { key: '/payment-transaction', label: 'Payment Transaction' },
      { key: '/point-transaction', label: 'Point Transaction' },
      { key: '/wager-stats', label: 'Wager Stats' }
    ],
    activeKey: '/payment-transaction'
  },
  parameters: { docs: { story: { autoplay: true } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const scrollRight = canvas.getByRole('button', { name: 'Scroll tabs right' });
    await expect(
      canvas.queryByRole('button', { name: 'Scroll tabs left' })
    ).not.toBeInTheDocument();

    await userEvent.click(scrollRight);
    await expect(await canvas.findByRole('button', { name: 'Scroll tabs left' })).toBeVisible();
  }
};

export const Reorder: TStory = {
  parameters: { docs: { story: { autoplay: true } } },
  play: async ({ args, canvasElement }) => {
    await dragTab(canvasElement, 'Dashboard', 'Reports');
    await expect(args.onMove).toHaveBeenCalledWith('/dashboard', '/reports');
  }
};

export const DragDisabled: TStory = {
  args: { isDraggable: false },
  parameters: { docs: { story: { autoplay: true } } },
  play: async ({ args, canvasElement }) => {
    await dragTab(canvasElement, 'Dashboard', 'Reports');
    await expect(args.onMove).not.toHaveBeenCalled();
  }
};
