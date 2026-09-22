import { useLocation } from '@tanstack/react-router';
import { useSelector } from '@tanstack/react-store';
import { useTranslation } from 'react-i18next';

import { Sidebar, SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import { Spinner } from '~/components/ui/spinner';
import { useApp } from '~/hooks/use-app';
import { useAppBootstrap } from '~/hooks/use-app-bootstrap';
import AppContentTabs from '~/layouts/AppContentTabs';
import AppHeader from '~/layouts/AppHeader';
import CategoryRail from '~/layouts/CategoryRail';
import Navbar from '~/layouts/Navbar';
import {
  buildNavCategoryForPath,
  buildNavLinks,
  DEFAULT_NAV_CATEGORY,
  NAV_CATEGORIES
} from '~/layouts/nav-links';
import { headerNavStore } from '~/store/header-nav-store';

export interface IAppLayoutProps {
  children: React.ReactNode;
}

interface ISidebarStyle extends React.CSSProperties {
  '--sidebar-width': string;
  '--sidebar-width-icon': string;
}

const SIDEBAR_STYLE: ISidebarStyle = {
  '--sidebar-width': '20rem',
  '--sidebar-width-icon': '6rem'
};

const AppLayout = ({ children }: IAppLayoutProps) => {
  const { isReady, isAuthRequired, currentRolePermissions } = useApp();
  const pathname = useLocation({ select: location => location.pathname });
  const selectedCategory = useSelector(headerNavStore, state => state.category);
  const { t } = useTranslation();

  const activeCategory =
    selectedCategory ?? buildNavCategoryForPath(pathname) ?? DEFAULT_NAV_CATEGORY;
  const categoryLabel =
    NAV_CATEGORIES.find(category => category.value === activeCategory)?.label ?? '';
  const navLinks = buildNavLinks(activeCategory, currentRolePermissions);

  useAppBootstrap();

  if (!isReady) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!isAuthRequired) {
    return (
      <div className="flex h-dvh flex-col">
        <AppHeader isSidebarAvailable={false} />
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    );
  }

  return (
    <SidebarProvider style={SIDEBAR_STYLE}>
      <Sidebar
        collapsible="offcanvas"
        className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      >
        <CategoryRail
          activeCategory={activeCategory}
          onSelect={headerNavStore.actions.setCategory}
        />
        <Navbar title={t(categoryLabel)} links={navLinks} />
      </Sidebar>
      <SidebarInset className="h-dvh min-w-0">
        <AppHeader isSidebarAvailable />
        <AppContentTabs>{children}</AppContentTabs>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
