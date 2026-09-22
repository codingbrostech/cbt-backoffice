import { buildHealthPayload } from './build-health-payload';

describe('buildHealthPayload', () => {
  describe('when the brand is known', () => {
    it('should report an ok status with the brand', () => {
      const payload = buildHealthPayload('SO', new Date('2026-01-01T00:00:00.000Z'));

      expect(payload).toEqual({
        status: 'ok',
        brand: 'SO',
        timestamp: '2026-01-01T00:00:00.000Z'
      });
    });
  });

  describe('when the brand is missing or unknown', () => {
    it('should report a misconfigured status', () => {
      expect(buildHealthPayload(undefined).status).toBe('misconfigured');
      expect(buildHealthPayload('XX').status).toBe('misconfigured');
    });
  });
});
