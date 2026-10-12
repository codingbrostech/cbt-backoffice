import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { buildErrorMessage } from '#/utils/error';

interface IQueryMeta extends Record<string, unknown> {
  isGlobalErrorSuppressed?: boolean;
}

declare module '@tanstack/react-query' {
  // eslint-disable-next-line @typescript-eslint/naming-convention -- TanStack Query module augmentation
  interface Register {
    queryMeta: IQueryMeta;
    mutationMeta: IQueryMeta;
  }
}

const STALE_TIME_MS = 60_000;

const notifyError = (error: unknown, meta?: IQueryMeta): void => {
  if (meta?.isGlobalErrorSuppressed) return;

  toast.error(buildErrorMessage(error));
};

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: STALE_TIME_MS, retry: false, refetchOnWindowFocus: false },
      mutations: { retry: false }
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        notifyError(error, query.meta);
      }
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _onMutateResult, mutation) => {
        notifyError(error, mutation.meta);
      }
    })
  });

  return {
    queryClient
  };
}
