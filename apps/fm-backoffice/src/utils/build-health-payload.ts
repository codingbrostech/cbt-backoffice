export interface IHealthPayload {
  status: 'ok';
  timestamp: string;
}

/**
 * Builds the JSON body served by the `/api/health` route.
 */
export const buildHealthPayload = (now = new Date()): IHealthPayload => ({
  status: 'ok',
  timestamp: now.toISOString()
});
