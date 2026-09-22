import { createFileRoute } from '@tanstack/react-router';

import { buildHealthPayload } from '#/utils/build-health-payload';

const MISCONFIGURED_STATUS = 503;

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: () => {
        const payload = buildHealthPayload(process.env.BRAND);

        return Response.json(payload, {
          status: payload.status === 'ok' ? 200 : MISCONFIGURED_STATUS
        });
      }
    }
  }
});
