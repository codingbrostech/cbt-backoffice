import { createFileRoute } from '@tanstack/react-router';

import PlaceholderPage from '#/pages/placeholder/PlaceholderPage';

export const Route = createFileRoute('/_authenticated/games/ranking')({
  component: PlaceholderPage
});
