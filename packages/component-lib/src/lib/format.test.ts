import { formatCount, formatMinorAmount } from '@cbt-bo/component-lib/lib/format';

describe('formatMinorAmount', () => {
  describe('when the value is a positive minor amount', () => {
    it('should render the grouped major amount', () => {
      expect(formatMinorAmount('123456')).toBe('1,234.56');
    });
  });

  describe('when the major amount is whole', () => {
    it('should drop the decimals', () => {
      expect(formatMinorAmount('87900')).toBe('879');
      expect(formatMinorAmount('-50000')).toBe('-500');
    });
  });

  describe('when the value is negative', () => {
    it('should keep the sign', () => {
      expect(formatMinorAmount(-5)).toBe('-0.05');
    });
  });

  describe('when the value is zero', () => {
    it('should render a plain zero', () => {
      expect(formatMinorAmount('0')).toBe('0');
    });
  });

  describe('when the value is blank or not a number', () => {
    it('should render a dash', () => {
      expect(formatMinorAmount()).toBe('-');
      expect(formatMinorAmount('')).toBe('-');
      expect(formatMinorAmount('abc')).toBe('-');
    });
  });
});

describe('formatCount', () => {
  describe('when the value is a number string', () => {
    it('should group the thousands', () => {
      expect(formatCount('12345')).toBe('12,345');
    });
  });

  describe('when the value is blank', () => {
    it('should render zero', () => {
      expect(formatCount()).toBe('0');
    });
  });
});
