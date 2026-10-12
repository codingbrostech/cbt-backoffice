import type { ReactNode } from 'react';

import { useSidebar } from '@cbt-bo/component-lib/components/ui/sidebar';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IBrandLogoProps {
  icon: ReactNode;
  brandName: string;
  className?: string;
}

/**
 * Brand mark for the header's `start` slot. Reads `useSidebar()`, so it has to
 * render inside a `SidebarProvider`. Shows `brandName` beside `icon` while the
 * rail is expanded and stays icon only once it collapses.
 */
const BrandLogo = ({ icon, brandName, className }: IBrandLogoProps) => {
  const { open: isNavExpanded } = useSidebar();

  return (
    <div
      className={cn(
        'flex items-center gap-2 transition-[margin] duration-200 ease-linear',
        isNavExpanded && 'ml-3',
        className
      )}
    >
      {icon}
      {isNavExpanded && <span className="truncate font-semibold">{brandName}</span>}
    </div>
  );
};

export default BrandLogo;
