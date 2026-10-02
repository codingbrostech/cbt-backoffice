import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { SidebarProvider } from '@cbt-bo/component-lib/components/ui/sidebar';
import type { TNavItem } from '@cbt-bo/component-lib/lib/nav-items';
import { isNavGroupItem } from '@cbt-bo/component-lib/lib/nav-items';
import { NAV_ITEMS } from '@cbt-bo/component-lib/lib/nav-items.mocks';

import AppSidebar from '.';
import type { IAppSidebarRootProps, IAppSidebarToggleProps } from '.';

type TStoryArgs = IAppSidebarRootProps & Pick<IAppSidebarToggleProps, 'openLabel' | 'closeLabel'>;

interface IPartControls {
  part: string;
  include: readonly (keyof TStoryArgs)[];
}

const PANEL_GROUP_HEADING_SELECTOR = '[data-slot="app-sidebar-panel"] button[aria-expanded]';

/**
 * The args grouped by the `AppSidebar` part that takes them.
 */
export const PART_CONTROLS = [
  { part: 'Root', include: ['items', 'activeKey', 'renderLink', 'className'] },
  { part: 'Toggle', include: ['openLabel', 'closeLabel'] }
] as const satisfies readonly IPartControls[];

const buildLeafKeys = (items: TNavItem[]): string[] =>
  items.flatMap(item => (isNavGroupItem(item) ? buildLeafKeys(item.children) : [item.key]));

const renderSidebar = ({ openLabel, closeLabel, ...args }: TStoryArgs) => (
  <AppSidebar.Root {...args}>
    <AppSidebar.Rail>
      <AppSidebar.Menu />
      <AppSidebar.Footer>
        <AppSidebar.Toggle openLabel={openLabel} closeLabel={closeLabel} />
      </AppSidebar.Footer>
    </AppSidebar.Rail>
    <AppSidebar.Panel />
  </AppSidebar.Root>
);

const meta = {
  title: 'Nav/AppSidebar',
  component: AppSidebar.Root,
  tags: ['!autodocs'],
  excludeStories: ['PART_CONTROLS'],
  args: {
    items: NAV_ITEMS,
    activeKey: 'dashboard',
    renderLink: (item, children) => <a href={item.path}>{children}</a>,
    children: null,
    openLabel: 'Open sidebar',
    closeLabel: 'Close sidebar'
  },
  argTypes: {
    items: {
      control: false,
      description: 'The nav tree. A leaf carries a `path`, a group carries `children`.',
      table: { category: 'Root' }
    },
    activeKey: {
      control: 'select',
      options: buildLeafKeys(NAV_ITEMS),
      description: 'Key of the leaf for the current page.',
      table: { category: 'Root' }
    },
    renderLink: {
      control: false,
      description: "Renders a leaf as the app's router link.",
      table: { category: 'Root' }
    },
    className: {
      description: 'Classes on `Root`, for example to override a width variable.',
      table: { category: 'Root' }
    },
    children: { table: { disable: true } },
    openLabel: {
      type: { name: 'string', required: true },
      description: 'Label of `Toggle` while the rail is collapsed.',
      table: { category: 'Toggle' }
    },
    closeLabel: {
      type: { name: 'string', required: true },
      description: 'Label of `Toggle` while the rail is expanded.',
      table: { category: 'Toggle' }
    }
  },
  parameters: { layout: 'fullscreen' },
  render: args => <SidebarProvider className="min-h-0">{renderSidebar(args)}</SidebarProvider>
} satisfies Meta<TStoryArgs>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Expanded: TStory = {};

export const GroupDocked: TStory = {
  parameters: { docs: { story: { autoplay: true } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('button', { name: 'Game' });

    await userEvent.click(group);

    await expect(group).toHaveAttribute('data-active', 'true');
    await expect(canvas.getByRole('link', { name: 'Game Categories' })).toBeVisible();
  }
};

export const SectionExpanded: TStory = {
  args: { activeKey: 'players' }
};

export const SectionCollapsed: TStory = {
  args: { activeKey: 'players' },
  parameters: {
    pseudo: { hover: PANEL_GROUP_HEADING_SELECTOR },
    docs: { story: { autoplay: true } }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('button', { name: 'Player Mgmt' });

    await userEvent.click(heading);

    await expect(heading).toHaveAttribute('aria-expanded', 'false');
    await expect(heading).toHaveAttribute('data-active', 'true');
  }
};

export const Collapsed: TStory = {
  render: args => (
    <SidebarProvider className="min-h-0" defaultOpen={false}>
      {renderSidebar(args)}
    </SidebarProvider>
  )
};

export const CollapsedPopover: TStory = {
  args: { activeKey: 'players' },
  parameters: { docs: { story: { autoplay: true } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Close sidebar' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Player' }));
  }
};
