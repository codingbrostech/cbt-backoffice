import { Link, useLocation } from '@tanstack/react-router';
import { ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '~/components/ui/sidebar';
import { type INavLink, type INavSubLink } from '~/layouts/nav-links';

export interface INavbarProps {
  title: string;
  links: INavLink[];
}

const NavLinkItem = ({ title, icon: Icon, link, isDisabled }: INavSubLink) => {
  const pathname = useLocation({ select: location => location.pathname });
  const { t } = useTranslation();
  const { setOpenMobile } = useSidebar();

  const isActive = !isDisabled && pathname === link;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} aria-disabled={isDisabled}>
        <Link
          to={link}
          className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
          onClick={() => {
            setOpenMobile(false);
          }}
        >
          <Icon />
          <span>{t(title)}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const NavGroupItem = ({ title, icon: Icon, subLinks = [], isDisabled }: INavLink) => {
  const pathname = useLocation({ select: location => location.pathname });
  const { t } = useTranslation();
  const { setOpenMobile } = useSidebar();

  return (
    <Collapsible asChild defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            aria-disabled={isDisabled}
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <Icon />
            <span>{t(title)}</span>
            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {subLinks.map(subLink => {
              const isActive = !subLink.isDisabled && pathname === subLink.link;

              return (
                <SidebarMenuSubItem key={subLink.link}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActive}
                    aria-disabled={subLink.isDisabled}
                  >
                    <Link
                      to={subLink.link}
                      className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                      onClick={() => {
                        setOpenMobile(false);
                      }}
                    >
                      <span>{t(subLink.title)}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const Navbar = ({ title, links }: INavbarProps) => (
  <Sidebar collapsible="none" className="hidden flex-1 md:flex">
    <SidebarHeader className="h-(--app-header-height) justify-center border-b px-4">
      <span className="truncate font-heading text-sm font-bold">{title}</span>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {links.map(link =>
              link.subLinks?.length ? (
                <NavGroupItem key={link.title} {...link} />
              ) : (
                <NavLinkItem key={link.link} {...link} />
              )
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
);

export default Navbar;
