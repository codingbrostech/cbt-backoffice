import { createFileRoute } from '@tanstack/react-router';

import PlaceholderPage from '#/pages/placeholder/PlaceholderPage';

export const Route = createFileRoute('/_authenticated/promotions/xp-shop')({
  component: PlaceholderPage
});
