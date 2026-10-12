import { createFileRoute, redirect } from '@tanstack/react-router';

import { PATH } from '#/constants/path';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: PATH.DASHBOARD });
  }
});
