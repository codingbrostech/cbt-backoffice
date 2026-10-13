import { hydrateSessionStore } from '@cbt-bo/api/auth/store';
import { initMgtClient } from '@cbt-bo/api/client';
import { hydratePageTabsStore } from '@cbt-bo/api/page-tabs/store';
import { hydratePreferencesStore } from '@cbt-bo/api/preferences/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from '#/App';
import { createQueryClient } from '#/lib/query-client';
import { loadRuntimeEnv } from '#/utils/runtime-env';

import '#/styles.css';

const ROOT_ELEMENT_ID = 'root';

const bootstrap = async (): Promise<void> => {
  const rootElement = document.getElementById(ROOT_ELEMENT_ID);

  if (!rootElement) throw new Error(`Missing #${ROOT_ELEMENT_ID} element in index.html`);

  initMgtClient(loadRuntimeEnv());
  await hydrateSessionStore();
  await hydratePreferencesStore();
  await hydratePageTabsStore();

  const queryClient = createQueryClient();

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools buttonPosition="bottom-right" />
      </QueryClientProvider>
    </StrictMode>
  );
};

void bootstrap();
