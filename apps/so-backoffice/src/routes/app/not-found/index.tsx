import { PagePlaceholder } from '@cbt-bo/component-lib/components/layout';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return <PagePlaceholder title={t('notFound.title')} description={t('notFound.description')} />;
};

export default NotFoundPage;
