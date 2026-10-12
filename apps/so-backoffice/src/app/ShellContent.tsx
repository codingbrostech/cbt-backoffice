import { HeaderTabs } from '@cbt-bo/component-lib/components/layout';
import type { TNavItem } from '@cbt-bo/component-lib/components/nav';
import { SidebarInset } from '@cbt-bo/component-lib/components/ui/sidebar';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { usePageTabs } from '#/hooks/use-page-tabs';

export interface IShellContentProps {
  items: TNavItem[];
  pathname: string;
  children: ReactNode;
}

/**
 * Main area of the authenticated shell. Renders the open page tabs for
 * `pathname` above `children`, inside the sidebar inset.
 */
const ShellContent = ({ items, pathname, children }: IShellContentProps) => {
  const { t } = useTranslation();
  const pageTabs = usePageTabs(items, pathname);

  return (
    <SidebarInset className="min-h-0 min-w-0 rounded-sm rounded-tl-md px-5 pt-2.5 pb-5 [[data-panel-docked]+&]:rounded-l-none">
      <HeaderTabs.Root {...pageTabs}>
        <HeaderTabs.ScrollArea
          scrollLeftLabel={t('common.scrollTabsLeft')}
          scrollRightLabel={t('common.scrollTabsRight')}
        >
          <HeaderTabs.List closeTabLabel={t('common.closeTab')} />
        </HeaderTabs.ScrollArea>
        <HeaderTabs.Actions
          label={t('common.tabActions')}
          closeSelectedTabLabel={t('common.closeSelectedTab')}
          closeOtherTabsLabel={t('common.closeOtherTabs')}
        />
      </HeaderTabs.Root>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-sm rounded-t-none border border-t-0 border-border bg-card px-5 pt-6 pb-2">
        {children}
      </div>
    </SidebarInset>
  );
};

export default ShellContent;
