import { createFileRoute } from '@tanstack/react-router';

import { buildHealthPayload } from '#/utils/build-health-payload';

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: () => Response.json(buildHealthPayload())
    }
  }
});
