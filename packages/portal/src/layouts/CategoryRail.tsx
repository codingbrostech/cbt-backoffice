import { useTranslation } from 'react-i18next';

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '~/components/ui/sidebar';
import type { TNavCategory } from '~/constants/path';
import { NAV_CATEGORIES } from '~/layouts/nav-links';

export interface ICategoryRailProps {
  activeCategory: TNavCategory;
  onSelect: (category: TNavCategory) => void;
}

const CategoryRail = ({ activeCategory, onSelect }: ICategoryRailProps) => {
  const { t } = useTranslation();

  return (
    <Sidebar collapsible="none" className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r">
      <SidebarContent>
        <SidebarMenu className="gap-1 px-1.5 py-2">
          {NAV_CATEGORIES.map(({ value, label, icon: Icon }) => (
            <SidebarMenuItem key={value}>
              <SidebarMenuButton
                isActive={value === activeCategory}
                className="h-auto flex-col gap-1 py-2 text-[11px] data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                onClick={() => {
                  onSelect(value);
                }}
              >
                <Icon className="size-5!" />
                <span className="truncate">{t(label)}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default CategoryRail;
