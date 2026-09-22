import {
  AppLayout,
  buildPortalHead,
  ColorSchemeScript,
  type IRuntimeEnv,
  NotFoundPage,
  PortalProviders,
  getPortalName
} from '@cbt-bo/portal/app';
import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import TanStackQueryDevtools from '#/integrations/tanstack-query/devtools';
import { getRuntimeEnv } from '#/server/runtime-env';
import appCss from '#/styles.css?url';

interface IRouterContext {
  queryClient: QueryClient;
}

const isRuntimeEnv = (value: unknown): value is IRuntimeEnv =>
  typeof value === 'object' && value !== null && 'brand' in value;

export const Route = createRootRouteWithContext<IRouterContext>()({
  loader: () => getRuntimeEnv(),
  head: ({ loaderData }) =>
    buildPortalHead({
      portalName: loaderData ? getPortalName(loaderData.brand) : '',
      stylesheetHref: appCss
    }),
  staleTime: Infinity,
  shellComponent: RootDocument,
  component: RootComponent,
  notFoundComponent: NotFoundPage
});

function RootComponent() {
  const env = Route.useLoaderData();

  return (
    <PortalProviders env={env}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </PortalProviders>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const brandAttribute = useRouterState({
    select: state => {
      const rootLoaderData: unknown = state.matches[0]?.loaderData;

      return isRuntimeEnv(rootLoaderData) ? rootLoaderData.brand.toLowerCase() : undefined;
    }
  });

  return (
    <html lang="en" data-brand={brandAttribute} suppressHydrationWarning>
      <head>
        <HeadContent />
        <ColorSchemeScript />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right'
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />
            },
            TanStackQueryDevtools
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
