import { useLocation } from '@tanstack/react-router';
import { LockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Page from '~/components/Page';
import { useApp } from '~/hooks/use-app';

export interface IProtectedPageProps {
  /**
   * i18n key of the page title.
   */
  title: string;
  children: React.ReactNode;
  /**
   * Which segment from the end of the pathname is the page key.
   * 1 is the last segment, 2 the one before it (for example `/players/$id`).
   * Defaults to 1.
   */
  segmentIndexFromEnd?: number;
}

const buildPageKey = (pathname: string, segmentIndexFromEnd: number): string => {
  const segments = pathname.split('/').filter(Boolean);
  const index = segments.length - segmentIndexFromEnd;

  return index >= 0 ? (segments[index] ?? '') : '';
};

const ProtectedPage = ({ title, children, segmentIndexFromEnd = 1 }: IProtectedPageProps) => {
  const { t } = useTranslation();
  const { currentRolePermissions } = useApp();
  const pathname = useLocation({ select: location => location.pathname });

  const pageKey = buildPageKey(pathname, segmentIndexFromEnd);
  const isReadAllowed = currentRolePermissions.some(
    permission =>
      permission.type === 'page' && permission.pageKey === pageKey && Boolean(permission.canRead)
  );

  if (!isReadAllowed) {
    return (
      <Page title={title}>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <LockIcon className="size-10" strokeWidth={1.5} />
            <p className="text-lg font-bold">{t('protectedPage.title')}</p>
            <p className="text-sm text-muted-foreground">{t('protectedPage.description')}</p>
          </div>
        </div>
      </Page>
    );
  }

  return <Page title={title}>{children}</Page>;
};

export default ProtectedPage;
