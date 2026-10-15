import type { ReactNode } from 'react';

import { usePage } from '@cbt-bo/component-lib/components/layout/Page/page-context';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IPageHeaderProps {
  /**
   * Everything above the table, usually `SearchBar.Root` and any summary.
   */
  children: ReactNode;
  className?: string;
}

/**
 * Column for the parts above the table, exposed as `Page.Header`. Under
 * `isPageScroll` it keeps the width of the nearest `@container` and stays put
 * while the table scrolls sideways.
 *
 * @example
 * <Page.Header>
 *   <SearchBar.Root>...</SearchBar.Root>
 * </Page.Header>
 */
const PageHeader = ({ children, className }: IPageHeaderProps) => {
  const { isPageScroll } = usePage();

  return (
    <div
      data-slot="page-header"
      className={cn(
        'flex shrink-0 flex-col gap-4',
        isPageScroll && 'sticky left-0 w-[100cqw]',
        className
      )}
    >
      {children}
    </div>
  );
};

PageHeader.displayName = 'Page.Header';

export default PageHeader;
