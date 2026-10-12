import HeaderTabsActions from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTabsActions';
import HeaderTabsList from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTabsList';
import HeaderTabsRoot from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTabsRoot';
import HeaderTabsScrollArea from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTabsScrollArea';

export type { IHeaderTab } from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTab';
export type { IHeaderTabsActionsProps } from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTabsActions';
export type { IHeaderTabsListProps } from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTabsList';
export type { IHeaderTabsRootProps } from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTabsRoot';
export type { IHeaderTabsScrollAreaProps } from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTabsScrollArea';

/**
 * Compound browser-style tab strip for the pages open in the authenticated
 * shell. The open `tabs`, the `activeKey` and the select, close and move
 * handlers come in through `Root` and reach the parts through context, so each
 * part takes only the labels it shows.
 *
 * @example
 * <HeaderTabs.Root
 *   tabs={tabs}
 *   activeKey={key}
 *   onSelect={select}
 *   onClose={close}
 *   onCloseOthers={closeOthers}
 *   onMove={move}
 * >
 *   <HeaderTabs.ScrollArea scrollLeftLabel="Left" scrollRightLabel="Right">
 *     <HeaderTabs.List closeTabLabel="Close tab" />
 *   </HeaderTabs.ScrollArea>
 *   <HeaderTabs.Actions
 *     label="Tab actions"
 *     closeSelectedTabLabel="Close selected tab"
 *     closeOtherTabsLabel="Close other tabs"
 *   />
 * </HeaderTabs.Root>
 */
const HeaderTabs = {
  Root: HeaderTabsRoot,
  ScrollArea: HeaderTabsScrollArea,
  List: HeaderTabsList,
  Actions: HeaderTabsActions
};

export default HeaderTabs;
