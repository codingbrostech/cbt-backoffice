import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { getPortalConfig } from '~/config';

export interface IPageProps {
  children: React.ReactNode;
  /**
   * i18n key of the document title.
   */
  title?: string;
}

const Page = ({ children, title }: IPageProps) => {
  const { t } = useTranslation();

  const pageTitle = title ? t(title) : '';

  useEffect(() => {
    if (pageTitle) document.title = `${pageTitle} | ${getPortalConfig().portalName}`;
  }, [pageTitle]);

  return <div className="flex min-h-0 flex-1 flex-col gap-4">{children}</div>;
};

export default Page;
