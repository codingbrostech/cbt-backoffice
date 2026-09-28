import { createFileRoute } from '@tanstack/react-router';

import PlaceholderPage from '#/pages/placeholder/PlaceholderPage';

export const Route = createFileRoute('/_authenticated/reports/bet-trans')({
  component: PlaceholderPage
});
