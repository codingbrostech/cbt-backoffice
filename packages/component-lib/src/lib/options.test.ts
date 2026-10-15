import { buildOptions } from '@cbt-bo/component-lib/lib/options';

describe('buildOptions', () => {
  describe('when a label builder is given', () => {
    it('should pair each value with its built label in order', () => {
      expect(buildOptions(['simple', 'detail'], view => `view.${view}`)).toEqual([
        { value: 'simple', label: 'view.simple' },
        { value: 'detail', label: 'view.detail' }
      ]);
    });
  });

  describe('when no label builder is given', () => {
    it('should use each value as its own label', () => {
      expect(buildOptions(['slot', 'table'])).toEqual([
        { value: 'slot', label: 'slot' },
        { value: 'table', label: 'table' }
      ]);
    });
  });

  describe('when the values are empty', () => {
    it('should return no options', () => {
      expect(buildOptions([])).toEqual([]);
    });
  });
});
