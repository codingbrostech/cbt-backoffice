import { ensureSession } from '@cbt-bo/api/auth/queries';
import { hydrateSessionStore } from '@cbt-bo/api/auth/store';
import { initMgtClient } from '@cbt-bo/api/client';
import { PageSpinner } from '@cbt-bo/component-lib/components/layout';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

import { buildPostLoginHref } from '#/constants/path';
import LoginPage from '#/pages/login/LoginPage';

const loginSearchSchema = z.object({
  redirect: z.string().optional()
});

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  ssr: false,
  beforeLoad: async ({ context: { env, queryClient }, search: { redirect: redirectTo } }) => {
    initMgtClient(env);
    await hydrateSessionStore();

    const user = await ensureSession(queryClient);

    if (user) throw redirect({ href: buildPostLoginHref(redirectTo) });
  },
  pendingComponent: PageSpinner,
  component: LoginPage
});
