import PageHeader from '@cbt-bo/component-lib/components/layout/Page/PageHeader';
import PageRoot from '@cbt-bo/component-lib/components/layout/Page/PageRoot';

export type { IPageHeaderProps } from '@cbt-bo/component-lib/components/layout/Page/PageHeader';
export type { IPageRootProps } from '@cbt-bo/component-lib/components/layout/Page/PageRoot';

/**
 * Compound frame for a list page in the authenticated shell. `Root` picks the
 * scroll mode and `Header` holds the parts above the table, so a page switches
 * between a grid that scrolls inside and a page that scrolls as a whole by
 * flipping `isPageScroll`.
 *
 * @example
 * <Page.Root isPageScroll>
 *   <Page.Header>
 *     <SearchBar.Root>...</SearchBar.Root>
 *   </Page.Header>
 *   <DataTable.Root isPageScroll>
 *     <DataTable.Grid />
 *     <DataTable.Pagination />
 *   </DataTable.Root>
 * </Page.Root>
 */
const Page = {
  Root: PageRoot,
  Header: PageHeader
};

export default Page;
