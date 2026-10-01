import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import HeaderTab from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTab';
import { useHeaderTabs } from '@cbt-bo/component-lib/components/layout/HeaderTabs/header-tabs-context';

export interface IHeaderTabsListProps {
  /**
   * Accessible label for each tab's close button.
   */
  closeTabLabel: string;
}

/**
 * Renders one `HeaderTab` per open tab, exposed as `HeaderTabs.List`. Tabs can be
 * dragged to reorder. Place it inside `HeaderTabs.ScrollArea`.
 */
const HeaderTabsList = ({ closeTabLabel }: IHeaderTabsListProps) => {
  const { tabs } = useHeaderTabs();

  const tabKeys = tabs.map(tab => tab.key);

  return (
    <SortableContext items={tabKeys} strategy={horizontalListSortingStrategy}>
      {tabs.map(tab => (
        <HeaderTab key={tab.key} tab={tab} closeTabLabel={closeTabLabel} />
      ))}
    </SortableContext>
  );
};

HeaderTabsList.displayName = 'HeaderTabs.List';

export default HeaderTabsList;
