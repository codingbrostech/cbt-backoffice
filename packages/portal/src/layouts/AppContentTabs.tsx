import { useLocation, useNavigate } from '@tanstack/react-router';
import { useSelector } from '@tanstack/react-store';
import { EllipsisIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { PATH_KEY_MAP, PATH_NAME_MAP, PATH_SLASH } from '~/constants/path';
import { useDebouncedCallback } from '~/hooks/use-debounced-callback';
import { AppContentTabsContext } from '~/layouts/app-content-tabs-context';
import { cn } from '~/lib/utils';
import { appTabsStore, type ITabItem } from '~/store/app-tabs-store';

export interface IAppContentTabsProps {
  children: React.ReactNode;
}

const TAB_REGISTER_DEBOUNCE_MS = 150;

const buildTabTitle = (tab: ITabItem, tabNames: Record<string, string>): string => {
  const pathKey = PATH_KEY_MAP[tab.pathname];
  const mappedName = pathKey ? PATH_NAME_MAP[pathKey] : undefined;

  return mappedName ?? tabNames[tab.pathname] ?? tab.pathname;
};

const AppContentTabs = ({ children }: IAppContentTabsProps) => {
  const tabs = useSelector(appTabsStore, state => state.tabs);
  const currentPathname = useSelector(appTabsStore, state => state.currentPathname);
  const tabNames = useSelector(appTabsStore, state => state.tabNames);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [toolbarNode, setToolbarNode] = useState<HTMLElement | null>(null);

  const { pathname, href } = location;
  const isCurrentTabRendered = pathname === currentPathname;
  const { openTab, removeTab, removeOtherTabs } = appTabsStore.actions;

  const registerTab = useDebouncedCallback((tab: ITabItem) => {
    openTab(tab);
  }, TAB_REGISTER_DEBOUNCE_MS);

  const activateTab = (tab: ITabItem) => {
    void navigate({ href: tab.href });
  };

  const closeTab = (tabPathname: string) => {
    if (tabs.length < 2) return;

    const remainingTabs = tabs.filter(tab => tab.pathname !== tabPathname);
    const [nextTab] = remainingTabs;

    removeTab(tabPathname);
    if (tabPathname === currentPathname && nextTab) activateTab(nextTab);
  };

  const closeOtherTabs = () => {
    if (currentPathname) removeOtherTabs(currentPathname);
  };

  useEffect(() => {
    if (pathname === PATH_SLASH) return;

    registerTab({ pathname, href });
  }, [pathname, href, registerTab]);

  return (
    <AppContentTabsContext.Provider value={{ toolbarNode }}>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center gap-1 border-b bg-muted/40 pr-1">
          <ScrollArea className="min-w-0 flex-1">
            <div role="tablist" className="flex items-end gap-0.5 px-1 pt-1">
              {tabs.map(tab => {
                const isActive = tab.pathname === currentPathname;

                return (
                  <div
                    key={tab.pathname}
                    role="tab"
                    tabIndex={0}
                    aria-selected={isActive}
                    className={cn(
                      'group flex h-8 max-w-52 cursor-pointer items-center gap-1 rounded-t-md border border-b-0 px-3 text-sm whitespace-nowrap select-none',
                      isActive
                        ? 'bg-background font-medium text-primary'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                    )}
                    onClick={() => {
                      activateTab(tab);
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter') activateTab(tab);
                    }}
                  >
                    <span className="truncate">{t(buildTabTitle(tab, tabNames))}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      aria-label={t('tabs.menu.closeSelected')}
                      className="rounded-sm p-0.5 opacity-60 hover:bg-accent hover:opacity-100"
                      onClick={event => {
                        event.stopPropagation();
                        closeTab(tab.pathname);
                      }}
                    >
                      <XIcon className="size-3.5" />
                    </span>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" className="h-1.5" />
          </ScrollArea>
          <div ref={setToolbarNode} className="flex items-center" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Tab options">
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  if (currentPathname) closeTab(currentPathname);
                }}
              >
                {t('tabs.menu.closeSelected')}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={closeOtherTabs}>
                {t('tabs.menu.closeOthers')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-auto p-4">
          {isCurrentTabRendered ? children : null}
        </div>
      </div>
    </AppContentTabsContext.Provider>
  );
};

export default AppContentTabs;
