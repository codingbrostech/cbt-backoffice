import type { ReactNode } from 'react';

import { PageContext } from '@cbt-bo/component-lib/components/layout/Page/page-context';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IPageRootProps {
  /**
   * Sizes the page to its content so the content area scrolls both ways,
   * instead of filling the area's height and letting the table scroll inside
   * its grid. Pass the same flag to `DataTable.Root`.
   */
  isPageScroll?: boolean;
  /**
   * The page's parts, usually `Page.Header` followed by `DataTable.Root`.
   */
  children: ReactNode;
  className?: string;
}

/**
 * Root of a list page, exposed as `Page.Root`. Renders the `main` element and
 * shares `isPageScroll` with its parts through context.
 *
 * @example
 * <Page.Root isPageScroll>
 *   <Page.Header>...</Page.Header>
 *   <DataTable.Root isPageScroll>...</DataTable.Root>
 * </Page.Root>
 */
const PageRoot = ({ isPageScroll = false, children, className }: IPageRootProps) => (
  <PageContext value={{ isPageScroll }}>
    <main
      data-slot="page"
      className={cn(
        'flex flex-col gap-4',
        isPageScroll ? 'min-w-min shrink-0' : 'min-h-0 flex-1',
        className
      )}
    >
      {children}
    </main>
  </PageContext>
);

PageRoot.displayName = 'Page.Root';

export default PageRoot;
