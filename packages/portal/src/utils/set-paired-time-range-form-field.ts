import type { ISearchField, ILooseKeyForm } from '~/types/data-table';
import type { DateType } from '~/utils/date';
import {
  applyPairedTimeRangeFormValues,
  areSameDateTime,
  toDateFormValue
} from '~/utils/list-time-search';

export type TPairedTimeRangeFieldConfig = Pick<
  ISearchField,
  | 'name'
  | 'timeRangeMaxMonths'
  | 'timeRangeRole'
  | 'timeRangePartner'
  | 'timeRangePresetField'
  | 'optionalPairedTimeRange'
>;

/**
 * Updates a paired time-range field without remounting the active DateTimePicker.
 * Mantine uncontrolled forms remount all inputs on `setValues`, which breaks in-progress time edits.
 */
export function setPairedTimeRangeFormField(
  form: ILooseKeyForm,
  field: TPairedTimeRangeFieldConfig,
  value: DateType | null,
  options?: { forceUpdate?: boolean }
) {
  const prev = form.getValues();
  const { name, timeRangePartner, timeRangePresetField, optionalPairedTimeRange } = field;
  const forceUpdate = options?.forceUpdate ?? false;

  const flipLinkedPresetToCustom = () => {
    if (!timeRangePresetField) return;
    if (Reflect.get(prev, timeRangePresetField) === 'custom') return;
    const prevValue = toDateFormValue(Reflect.get(prev, name));
    if (areSameDateTime(prevValue, value)) return;
    form.setFieldValue(timeRangePresetField, 'custom', { forceUpdate: true });
  };

  if (optionalPairedTimeRange && timeRangePartner) {
    const partnerValue = toDateFormValue(Reflect.get(prev, timeRangePartner));
    const valueEmpty = value == null || value === '';
    const partnerEmpty = partnerValue == null || partnerValue === '';
    if (valueEmpty && partnerEmpty) {
      form.setFieldValue(name, null, { forceUpdate });
      form.setFieldValue(timeRangePartner, null, { forceUpdate: true });
      return;
    }
  }

  const updates = applyPairedTimeRangeFormValues(field, value, prev);

  form.setFieldValue(name, updates[name] ?? null, { forceUpdate });
  flipLinkedPresetToCustom();

  if (!timeRangePartner) return;

  const nextPartner = updates[timeRangePartner] ?? null;
  const prevPartner = toDateFormValue(Reflect.get(prev, timeRangePartner));
  if (!areSameDateTime(prevPartner, nextPartner)) {
    form.setFieldValue(timeRangePartner, nextPartner, { forceUpdate: true });
  }
}
