/**
 * Pairs each value with its display label as `{ value, label }` options.
 * Without `buildLabel`, the value is its own label.
 *
 * @example
 * buildOptions(TABLE_VIEWS, view => t(`common.viewOption.${view}`))
 */
export const buildOptions = <TValue extends string>(
  values: readonly TValue[],
  buildLabel: (value: TValue) => string = value => value
): { value: TValue; label: string }[] => values.map(value => ({ value, label: buildLabel(value) }));
