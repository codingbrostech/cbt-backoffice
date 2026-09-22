import { Link } from '@tanstack/react-router';
import { CompassIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Page from '~/components/Page';
import { Button } from '~/components/ui/button';
import { PATH } from '~/constants/path';

/**
 * Rendered by the root route for paths that match no route file.
 */
const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Page title="notFound.title">
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <CompassIcon className="size-10" strokeWidth={1.5} />
          <p className="text-lg font-bold">{t('notFound.title')}</p>
          <p className="text-sm text-muted-foreground">{t('notFound.description')}</p>
          <Button asChild variant="outline" className="mt-2">
            <Link to={PATH.PATH_HOME}>{t('notFound.backHome')}</Link>
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default NotFoundPage;
