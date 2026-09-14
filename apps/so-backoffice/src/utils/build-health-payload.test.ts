import { buildHealthPayload } from './build-health-payload';

describe('buildHealthPayload', () => {
  describe('when called with a fixed date', () => {
    it('should report an ok status', () => {
      const payload = buildHealthPayload(new Date('2026-01-01T00:00:00.000Z'));

      expect(payload.status).toBe('ok');
    });

    it('should serialize the date as an ISO timestamp', () => {
      const payload = buildHealthPayload(new Date('2026-01-01T00:00:00.000Z'));

      expect(payload.timestamp).toBe('2026-01-01T00:00:00.000Z');
    });
  });
});
