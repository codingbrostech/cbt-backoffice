import { type ColumnDef, type RowData, createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import CopyableValue from '~/components/CopyableValue';
import MaskedValue from '~/components/MaskedValue';
import i18n from '~/i18n/config';
import { type TABLE_FEATURES, type TTableFeatures } from '~/table/features';
import { type DateType, formatDate } from '~/utils/date';
import { toCrpytoCurrecny, toCurrency, toPoint } from '~/utils/number';

export type TColumnDef<TRow extends RowData> = ColumnDef<TTableFeatures, TRow>;

export type TFieldFormatterType =
  'date' | 'map' | 'booleanMap' | 'currency' | 'point' | 'cryptoCurrency' | 'copyable' | 'custom';

export type TFieldFormatter<TRow extends RowData> = (
  row: TRow,
  field: keyof TRow
) => React.ReactNode;

export interface IFormatterOptions<TRow extends RowData> {
  /**
   * i18n prefix for `map` formatters. Defaults to the field name.
   */
  fieldMapName?: string;
  defaultValue?: string;
  dateFormat?: string;
  customFormatter?: TFieldFormatter<TRow>;
}

export interface IFieldOptions<TRow extends RowData> {
  translateKey?: string;
  formatterType?: TFieldFormatterType;
  formatter?: TFieldFormatter<TRow>;
  formatterOptions?: IFormatterOptions<TRow>;
  size?: number;
  /**
   * The cell renders a component, so the detail pane and exports show the
   * raw value instead.
   */
  isCustomCell?: boolean;
  /**
   * Adds a copy button next to the value in the detail pane. Defaults to
   * true for `copyable` fields.
   */
  isDetailCopyEnabled?: boolean;
  /**
   * Masks the value unless the role may view sensitive data.
   */
  isSensitive?: boolean;
  /**
   * The detail pane entry spans both columns.
   */
  isFullWidth?: boolean;
  /**
   * Hides the detail pane entry for rows that fail the check.
   */
  shouldShow?: (row: TRow) => boolean;
}

export interface IDetailItem<TRow extends RowData> {
  field: keyof TRow & string;
  translateKey: string;
  format: TFieldFormatter<TRow>;
  isCopyEnabled: boolean;
  isFullWidth: boolean;
  shouldShow?: (row: TRow) => boolean;
}

export type TExportFormatters<TRow extends RowData> = Partial<
  Record<keyof TRow & string, (row: TRow) => string>
>;

export interface IBuildTableConfigOptions<TRow extends RowData> {
  /**
   * i18n prefix of the labels, `${modelName}.${field}`.
   */
  modelName: string;
  columnsOrder: readonly (keyof TRow & string)[];
  detailsOrder?: readonly (keyof TRow & string)[];
  fieldOptions?: Partial<Record<keyof TRow & string, IFieldOptions<TRow>>>;
}

export interface ITableConfig<TRow extends RowData> {
  columns: TColumnDef<TRow>[];
  detailItems: IDetailItem<TRow>[];
  exportFormatters: TExportFormatters<TRow>;
}

const EMPTY_VALUE = '-';

const isBlank = (value: unknown): boolean => value === null || value === undefined || value === '';

const isCryptoRow = (row: unknown): row is { coinType?: string; coinDecimal?: number } =>
  typeof row === 'object' && row !== null;

const isStringOrNumber = (value: unknown): value is string | number =>
  typeof value === 'string' || typeof value === 'number';

const isDateInput = (value: unknown): value is DateType =>
  isStringOrNumber(value) || value instanceof Date;

const TranslatedHeader = ({ translateKey }: { translateKey: string }) => {
  const { t } = useTranslation();

  return <>{t(translateKey)}</>;
};

const buildDefaultFormatter =
  <TRow extends RowData>(defaultValue: string): TFieldFormatter<TRow> =>
  (row, field) => {
    const raw: unknown = row[field];

    return isBlank(raw) ? defaultValue : String(raw);
  };

/**
 * Cell formatter for a field. Falls back to the raw value, or
 * `formatterOptions.defaultValue` when the value is blank. With `isDetail`,
 * component cells (`copyable`, `isCustomCell`) render their raw value.
 */
export const buildFormatter = <TRow extends RowData>(
  options: IFieldOptions<TRow>,
  isDetail = false
): TFieldFormatter<TRow> => {
  const { formatter, formatterType, formatterOptions = {}, isCustomCell, isSensitive } = options;
  const {
    defaultValue = EMPTY_VALUE,
    fieldMapName,
    dateFormat,
    customFormatter
  } = formatterOptions;
  const defaultFormatter = buildDefaultFormatter<TRow>(defaultValue);

  const formatters: Record<TFieldFormatterType, TFieldFormatter<TRow>> = {
    date: (row, field) => {
      const raw: unknown = row[field];
      if (!isDateInput(raw) || isBlank(raw) || !dayjs(raw).isValid()) return EMPTY_VALUE;

      return formatDate(raw, dateFormat);
    },
    map: (row, field) => {
      const raw: unknown = row[field];
      if (isBlank(raw)) return defaultValue;

      const value = String(raw);
      const mapName = fieldMapName ?? String(field);

      return i18n.t([`${mapName}.${value}`, value]);
    },
    booleanMap: (row, field) => {
      const raw: unknown = row[field];
      if (raw === true) return i18n.t('boolean.true');
      if (raw === false) return i18n.t('boolean.false');

      return formatterOptions.defaultValue ?? i18n.t('boolean.false');
    },
    currency: (row, field) => {
      const raw: unknown = row[field];

      return isStringOrNumber(raw) && !isBlank(raw) ? toCurrency(raw) : EMPTY_VALUE;
    },
    point: (row, field) => {
      const raw: unknown = row[field];

      return isStringOrNumber(raw) ? toPoint(raw) : EMPTY_VALUE;
    },
    cryptoCurrency: (row, field) => {
      const raw: unknown = row[field];
      if (!isStringOrNumber(raw) || isBlank(raw) || !isCryptoRow(row)) return EMPTY_VALUE;

      const { coinType, coinDecimal } = row;
      const decimals = coinDecimal ?? (coinType === 'TON' ? 9 : 6);

      return toCrpytoCurrecny(raw, decimals);
    },
    copyable: (row, field) => {
      const raw: unknown = row[field];

      return isStringOrNumber(raw) && !isBlank(raw) ? <CopyableValue value={raw} /> : EMPTY_VALUE;
    },
    custom: (row, field) => customFormatter?.(row, field) ?? EMPTY_VALUE
  };

  const isRawInDetail = isDetail && (isCustomCell === true || formatterType === 'copyable');
  const baseFormatter = isRawInDetail
    ? defaultFormatter
    : (formatter ?? (formatterType ? formatters[formatterType] : defaultFormatter));

  if (!isSensitive) return baseFormatter;

  return (row, field) => <MaskedValue value={baseFormatter(row, field)} />;
};

const buildExportFormatter =
  <TRow extends RowData>(format: TFieldFormatter<TRow>, field: keyof TRow) =>
  (row: TRow): string => {
    const value = format(row, field);

    return isStringOrNumber(value) ? String(value) : '';
  };

/**
 * Columns, detail pane items and export formatters for a model. Labels
 * translate `${modelName}.${field}` and values render through the field's
 * formatter.
 *
 * @example
 * const { columns, detailItems } = buildTableConfig<AdminResult>({
 *   modelName: 'admins',
 *   columnsOrder: ['name', 'code', 'state'],
 *   detailsOrder: ['id', 'name', 'code', 'state'],
 *   fieldOptions: { state: { formatterType: 'map' } }
 * });
 */
export const buildTableConfig = <TRow extends RowData>({
  modelName,
  columnsOrder,
  detailsOrder = [],
  fieldOptions = {}
}: IBuildTableConfigOptions<TRow>): ITableConfig<TRow> => {
  const helper = createColumnHelper<typeof TABLE_FEATURES, TRow>();

  const columns = columnsOrder.map(field => {
    const options = fieldOptions[field] ?? {};
    const { translateKey = `${modelName}.${field}`, size } = options;
    const format = buildFormatter(options);

    return helper.display({
      id: field,
      header: () => <TranslatedHeader translateKey={translateKey} />,
      cell: ({ row }) => format(row.original, field),
      size
    });
  });

  const detailItems = detailsOrder.map(field => {
    const options = fieldOptions[field] ?? {};
    const {
      translateKey = `${modelName}.${field}`,
      isDetailCopyEnabled = options.formatterType === 'copyable',
      isFullWidth = false,
      shouldShow
    } = options;

    return {
      field,
      translateKey,
      format: buildFormatter(options, true),
      isCopyEnabled: isDetailCopyEnabled,
      isFullWidth,
      shouldShow
    };
  });

  const exportFormatters: TExportFormatters<TRow> = {};
  for (const field of columnsOrder) {
    exportFormatters[field] = buildExportFormatter(
      buildFormatter(fieldOptions[field] ?? {}, true),
      field
    );
  }

  return { columns, detailItems, exportFormatters };
};

/**
 * Column definitions only, see `buildTableConfig`.
 */
export const buildColumnDefs = <TRow extends RowData>(
  options: Omit<IBuildTableConfigOptions<TRow>, 'detailsOrder'>
): TColumnDef<TRow>[] => buildTableConfig(options).columns;
