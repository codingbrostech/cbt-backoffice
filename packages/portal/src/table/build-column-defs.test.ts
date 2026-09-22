import { initI18n } from '~/i18n/config';

import { buildColumnDefs, buildFormatter } from './build-column-defs';

interface IRow {
  name?: string | null;
  state?: string;
  isActive?: boolean;
  amount?: number;
  createdAt?: string;
  coinType?: string;
  coinDecimal?: number;
  units?: number;
}

describe('buildFormatter', () => {
  beforeAll(() => {
    initI18n('en');
  });

  describe('when no formatter type is given', () => {
    it('should render the raw value and the default for blanks', () => {
      const format = buildFormatter<IRow>({ formatterOptions: { defaultValue: 'n/a' } });

      expect(format({ name: 'Ada' }, 'name')).toBe('Ada');
      expect(format({ name: '' }, 'name')).toBe('n/a');
      expect(format({ name: null }, 'name')).toBe('n/a');
    });
  });

  describe('when the type is map', () => {
    it('should translate through the field map and fall back to the value', () => {
      const format = buildFormatter<IRow>({ formatterType: 'map' });

      expect(format({ state: 'active' }, 'state')).toBe('Active');
      expect(format({ state: 'unmapped' }, 'state')).toBe('unmapped');
      expect(format({}, 'state')).toBe('-');
    });
  });

  describe('when the type is booleanMap', () => {
    it('should translate booleans', () => {
      const format = buildFormatter<IRow>({ formatterType: 'booleanMap' });

      expect(format({ isActive: true }, 'isActive')).toBe('Yes');
      expect(format({ isActive: false }, 'isActive')).toBe('No');
      expect(format({}, 'isActive')).toBe('No');
    });
  });

  describe('when the type is currency', () => {
    it('should convert minor units to a formatted amount', () => {
      const format = buildFormatter<IRow>({ formatterType: 'currency' });

      expect(format({ amount: 123456 }, 'amount')).toBe('1,234.56');
      expect(format({}, 'amount')).toBe('-');
    });
  });

  describe('when the type is date', () => {
    it('should format valid dates and dash the rest', () => {
      const format = buildFormatter<IRow>({
        formatterType: 'date',
        formatterOptions: { dateFormat: 'YYYY-MM-DD' }
      });

      expect(format({ createdAt: '2026-09-21T10:00:00Z' }, 'createdAt')).toBe('2026-09-21');
      expect(format({ createdAt: 'not a date' }, 'createdAt')).toBe('-');
    });
  });

  describe('when the type is cryptoCurrency', () => {
    it('should divide by the coin decimals', () => {
      const format = buildFormatter<IRow>({ formatterType: 'cryptoCurrency' });

      expect(format({ units: 1500000, coinType: 'USDT', coinDecimal: 6 }, 'units')).toBe('1.5');
      expect(format({ units: 2000000000, coinType: 'TON' }, 'units')).toBe('2');
    });
  });

  describe('when a custom formatter is given', () => {
    it('should use it', () => {
      const format = buildFormatter<IRow>({
        formatterType: 'custom',
        formatterOptions: { customFormatter: row => `${row.name ?? ''}!` }
      });

      expect(format({ name: 'Ada' }, 'name')).toBe('Ada!');
    });
  });
});

describe('buildColumnDefs', () => {
  describe('when given a column order', () => {
    it('should create one display column per field with the field as id', () => {
      const columns = buildColumnDefs<IRow>({
        modelName: 'admins',
        columnsOrder: ['name', 'state'],
        fieldOptions: { state: { size: 80 } }
      });

      expect(columns.map(column => column.id)).toEqual(['name', 'state']);
      expect(columns[1]?.size).toBe(80);
    });
  });
});
