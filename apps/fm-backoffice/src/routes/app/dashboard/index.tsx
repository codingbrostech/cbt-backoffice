import { useSessionStore } from '@cbt-bo/api/auth/store';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { name = '' } = useSessionStore(state => state.user) ?? {};

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
      <p className="text-muted-foreground">{t('dashboard.welcome', { name })}</p>
    </main>
  );
};

export default DashboardPage;
