import { type TBrand, isKnownBrand } from '@cbt-bo/portal/app';

export interface IHealthPayload {
  status: 'ok' | 'misconfigured';
  brand?: TBrand;
  timestamp: string;
}

/**
 * Builds the JSON body served by the `/api/health` route. Reports
 * `misconfigured` when `brand` is not a known brand, so a pod without a
 * valid BRAND never passes its readiness probe.
 */
export const buildHealthPayload = (brand: string | undefined, now = new Date()): IHealthPayload =>
  isKnownBrand(brand)
    ? { status: 'ok', brand, timestamp: now.toISOString() }
    : { status: 'misconfigured', timestamp: now.toISOString() };
