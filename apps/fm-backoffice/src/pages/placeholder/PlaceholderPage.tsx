import { PagePlaceholder } from '@cbt-bo/component-lib/components/layout';
import { buildActiveNavItem } from '@cbt-bo/component-lib/components/nav';
import { useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { buildNavItems } from '#/constants/nav-items';

const PlaceholderPage = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const items = buildNavItems(t);
  const { label = '' } = buildActiveNavItem(items, pathname) ?? {};

  return <PagePlaceholder title={label} description={t('common.underConstruction')} />;
};

export default PlaceholderPage;
