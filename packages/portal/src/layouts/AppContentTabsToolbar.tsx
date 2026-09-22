import { RefreshCwIcon } from 'lucide-react';
import { createPortal } from 'react-dom';

import { Button } from '~/components/ui/button';
import { useAppContentTabs } from '~/layouts/app-content-tabs-context';

export interface IAppContentTabsToolbarProps {
  onRefresh?: () => void;
}

/**
 * Renders a refresh button into the tab strip toolbar of `AppContentTabs`.
 */
const AppContentTabsToolbar = ({ onRefresh }: IAppContentTabsToolbarProps) => {
  const { toolbarNode } = useAppContentTabs();

  if (!toolbarNode) return null;

  return createPortal(
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Refresh"
      onClick={() => {
        onRefresh?.();
      }}
    >
      <RefreshCwIcon />
    </Button>,
    toolbarNode
  );
};

export default AppContentTabsToolbar;
