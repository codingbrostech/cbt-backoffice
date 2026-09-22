import { isEqual } from 'radash';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Combobox from '~/components/Combobox';
import DateTimePicker from '~/components/DateTimePicker';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';
import { useAppForm } from '~/forms/use-app-form';
import { cn } from '~/lib/utils';
import type { TSearchFormValue, TSearchValues } from '~/table/search-values';
import type { ISelectOption } from '~/table/types';
import { TIME_RANGE_PRESETS, type ILooseKeyForm, type ISearchField } from '~/types/data-table';
import type { DateType } from '~/utils/date';
import {
  TIME_RANGE_FROM_FIELD,
  TIME_RANGE_MAX_ONE_MONTH,
  TIME_RANGE_TO_FIELD,
  fillMissingPairedTimeRangeValues,
  getListTimePickerDateBounds,
  getListTimePresetDefaultRange,
  isTimeRangePreset,
  toDateFormValue
} from '~/utils/list-time-search';
import { setPairedTimeRangeFormField } from '~/utils/set-paired-time-range-form-field';

export interface IDataTableSearchProps {
  fields: ISearchField[];
  values: TSearchValues;
  /**
   * Values the form shows after a reset. Defaults to `values`.
   */
  defaultValues?: TSearchValues;
  onSubmit: (values: TSearchValues) => void;
  onReset: () => void;
  /**
   * Whether field labels are i18n keys. Defaults to true.
   */
  isTranslatingLabels?: boolean;
}

const isLikeFieldName = (name: string): string => `${name}IsLike`;

const asString = (value: TSearchFormValue): string => (typeof value === 'string' ? value : '');

const asStringArray = (value: TSearchFormValue): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const asDate = (value: TSearchFormValue): DateType | null => toDateFormValue(value) ?? null;

const isPairedField = (field: ISearchField): boolean =>
  Boolean(field.timeRangeMaxMonths && field.timeRangeRole && field.timeRangePartner);

/**
 * Config-driven search bar for list pages. Submit reports the entered values
 * with paired time ranges filled and clamped, reset restores `defaultValues`
 * and hands control back to the page so route defaults apply. The form
 * follows `values` only when their content changes, so unsubmitted input
 * survives re-renders that rebuild the same values.
 */
const DataTableSearch = ({
  fields,
  values,
  defaultValues = values,
  onSubmit,
  onReset,
  isTranslatingLabels = true
}: IDataTableSearchProps) => {
  const { t } = useTranslation();
  const syncedValuesRef = useRef(values);
  const form = useAppForm({
    defaultValues: values,
    onSubmit: ({ value }) => {
      onSubmit(fillMissingPairedTimeRangeValues(fields, value));
    }
  });

  const looseForm = useMemo<ILooseKeyForm>(
    () => ({
      getValues: () => form.state.values,
      setFieldValue: (path, value) => {
        form.setFieldValue(path, value as TSearchFormValue);
      }
    }),
    [form]
  );
  const presetOptions = useMemo<ISelectOption[]>(
    () =>
      TIME_RANGE_PRESETS.map(preset => ({ value: preset, label: t(`timeRangePreset.${preset}`) })),
    [t]
  );

  const buildOptions = (field: ISearchField): ISelectOption[] =>
    (field.options ?? []).map(option => ({
      ...option,
      label:
        field.isTranslatingOptions === false || !isTranslatingLabels
          ? option.label
          : t(option.label)
    }));

  const selectPreset = (field: ISearchField, preset: string | null) => {
    if (!isTimeRangePreset(preset)) return;

    const {
      name,
      timeRangeFromField = TIME_RANGE_FROM_FIELD,
      timeRangeToField = TIME_RANGE_TO_FIELD,
      timeRangeMaxMonths = TIME_RANGE_MAX_ONE_MONTH
    } = field;
    const { timeFrom, timeTo } = getListTimePresetDefaultRange(preset, timeRangeMaxMonths);

    form.setFieldValue(name, preset);
    form.setFieldValue(timeRangeFromField, timeFrom);
    form.setFieldValue(timeRangeToField, timeTo);
  };

  const selectDate = (field: ISearchField, value: string | null) => {
    if (isPairedField(field)) {
      setPairedTimeRangeFormField(looseForm, field, value);
      return;
    }

    form.setFieldValue(field.name, value);
  };

  const resetForm = () => {
    syncedValuesRef.current = defaultValues;
    form.reset(defaultValues);
    onReset();
  };

  useEffect(() => {
    if (isEqual(syncedValuesRef.current, values)) return;

    syncedValuesRef.current = values;
    form.reset(values);
  }, [form, values]);

  return (
    <form
      className="flex flex-wrap items-end gap-2 rounded-md border bg-card p-3"
      onSubmit={event => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      onReset={event => {
        event.preventDefault();
        resetForm();
      }}
    >
      {fields.map(field => {
        const { name, label, inputType = 'text' } = field;
        const fieldLabel = isTranslatingLabels ? t(label) : label;
        const fieldId = `search-${name}`;
        const dateBounds = getListTimePickerDateBounds(field);

        return (
          <form.Field key={name} name={name}>
            {fieldApi => (
              <div
                className={cn('flex flex-col gap-1', inputType === 'datetime' ? 'w-52' : 'w-44')}
              >
                <Label htmlFor={fieldId} className="text-xs text-muted-foreground">
                  {fieldLabel}
                </Label>
                {inputType === 'select' && field.isMultiSelect && (
                  <Combobox
                    id={fieldId}
                    isMulti
                    options={buildOptions(field)}
                    searchText={field.selectSearchText}
                    placeholder={t('common.all')}
                    value={asStringArray(fieldApi.state.value)}
                    onChange={fieldApi.handleChange}
                  />
                )}
                {inputType === 'select' && !field.isMultiSelect && (
                  <Combobox
                    id={fieldId}
                    options={buildOptions(field)}
                    searchText={field.selectSearchText}
                    placeholder={t('common.all')}
                    value={asString(fieldApi.state.value) || null}
                    onChange={value => {
                      fieldApi.handleChange(value ?? undefined);
                    }}
                  />
                )}
                {inputType === 'segmented' && (
                  <ToggleGroup
                    id={fieldId}
                    type="single"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    value={asString(fieldApi.state.value)}
                    onValueChange={value => {
                      if (value) fieldApi.handleChange(value);
                    }}
                  >
                    {buildOptions(field).map(option => (
                      <ToggleGroupItem key={option.value} value={option.value} className="flex-1">
                        {option.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                )}
                {inputType === 'timeRangePreset' && (
                  <Combobox
                    id={fieldId}
                    options={presetOptions}
                    isClearable={false}
                    value={asString(fieldApi.state.value) || null}
                    onChange={value => {
                      selectPreset(field, value);
                    }}
                  />
                )}
                {(inputType === 'datetime' || inputType === 'date' || inputType === 'month') && (
                  <DateTimePicker
                    id={fieldId}
                    mode={inputType}
                    value={asDate(fieldApi.state.value)}
                    minDate={dateBounds.minDate ?? field.minDate}
                    maxDate={dateBounds.maxDate ?? field.maxDate}
                    onChange={value => {
                      selectDate(field, value);
                    }}
                  />
                )}
                {inputType === 'text' && (
                  <div className="flex items-center gap-2">
                    <Input
                      id={fieldId}
                      className="h-8"
                      value={asString(fieldApi.state.value)}
                      onBlur={fieldApi.handleBlur}
                      onChange={event => {
                        fieldApi.handleChange(event.target.value || undefined);
                      }}
                    />
                    {field.withIsLike && (
                      <form.Field name={isLikeFieldName(name)}>
                        {isLikeApi => (
                          <Label className="gap-1 text-xs whitespace-nowrap text-muted-foreground">
                            <Checkbox
                              checked={isLikeApi.state.value === true}
                              onCheckedChange={checked => {
                                isLikeApi.handleChange(checked === true);
                              }}
                            />
                            {t('common.isLike')}
                          </Label>
                        )}
                      </form.Field>
                    )}
                  </div>
                )}
              </div>
            )}
          </form.Field>
        );
      })}
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          {t('common.search')}
        </Button>
        <Button type="reset" size="sm" variant="outline">
          {t('common.reset')}
        </Button>
      </div>
    </form>
  );
};

export default DataTableSearch;
