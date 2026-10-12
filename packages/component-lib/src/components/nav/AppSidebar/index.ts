import AppSidebarFooter from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarFooter';
import AppSidebarMenu from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarMenu';
import AppSidebarPanel from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarPanel';
import AppSidebarRail from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarRail';
import AppSidebarRoot from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarRoot';
import AppSidebarToggle from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarToggle';

export type { IAppSidebarFooterProps } from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarFooter';
export type { IAppSidebarMenuProps } from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarMenu';
export type { IAppSidebarPanelProps } from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarPanel';
export type { IAppSidebarRailProps } from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarRail';
export type { IAppSidebarRootProps } from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarRoot';
export type { IAppSidebarToggleProps } from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarToggle';

/**
 * Compound nav rail with no routing dependency. `items`, `activeKey` and
 * `renderLink` come in through `Root` and reach the parts through context.
 * `Menu` renders the top-level items on the rail, and `Panel` and the collapsed
 * rail's popover render a group's children through `AppSidebarNavList`.
 *
 * @example
 * <AppSidebar.Root items={items} activeKey={activeKey} renderLink={renderLink}>
 *   <AppSidebar.Rail>
 *     <AppSidebar.Menu />
 *     <AppSidebar.Footer>
 *       <AppSidebar.Toggle openLabel="Open sidebar" closeLabel="Close sidebar" />
 *     </AppSidebar.Footer>
 *   </AppSidebar.Rail>
 *   <AppSidebar.Panel />
 * </AppSidebar.Root>
 */
const AppSidebar = {
  Root: AppSidebarRoot,
  Rail: AppSidebarRail,
  Menu: AppSidebarMenu,
  Footer: AppSidebarFooter,
  Toggle: AppSidebarToggle,
  Panel: AppSidebarPanel
};

export default AppSidebar;
