import type { MouseEvent } from 'react';
import { useId } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import SearchBarDateRangePicker, {
  type ISearchBarDateRangePickerLabels
} from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarDateRangePicker';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { Field, FieldLabel } from '@cbt-bo/component-lib/components/ui/field';
import {
  type IDateTimeRange,
  QUICK_RANGES,
  TIME_RANGE_MAX_ONE_MONTHS,
  type TQuickRange,
  buildCalendarDate,
  buildCustomRange,
  buildGmtLabel,
  buildQuickRange,
  clampDateTimeRange
} from '@cbt-bo/component-lib/lib/date-range';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISearchBarDateRangeFieldLabels extends ISearchBarDateRangePickerLabels {
  /**
   * Accessible name of the quick range button group.
   */
  quickRange: string;
  quickRanges: Record<TQuickRange, string>;
  /**
   * The button after the quick ranges, active when the range matches none of them.
   */
  custom: string;
}

export interface ISearchBarDateRangeFieldProps {
  /**
   * Form field holding the range start as a `YYYY-MM-DDTHH:mm` value.
   */
  fromName: string;
  /**
   * Form field holding the range end as a `YYYY-MM-DDTHH:mm` value.
   */
  toName: string;
  label: string;
  /**
   * UTC offset in minutes the quick ranges are computed at and the badge shows.
   */
  timezoneMinutes: number;
  labels: ISearchBarDateRangeFieldLabels;
  /**
   * Quick range buttons in display order. Defaults to QUICK_RANGES.
   */
  quickRanges?: readonly TQuickRange[];
  /**
   * Longest span in months a picked range may cover, and the length of the
   * custom button's starting window. Defaults to TIME_RANGE_MAX_ONE_MONTHS.
   */
  maxMonths?: number;
  className?: string;
}

/**
 * Time range filter bound to `fromName` and `toName` on the bar's form,
 * exposed as `SearchBar.DateRangeField`. A quick range button submits the bar
 * at once, while a range picked in the calendar waits for the search button.
 *
 * @example
 * <SearchBar.Fields>
 *   <SearchBar.DateRangeField
 *     fromName="timeFrom"
 *     toName="timeTo"
 *     label="Bet Time"
 *     timezoneMinutes={480}
 *     labels={dateRangeLabels}
 *   />
 * </SearchBar.Fields>
 */
const SearchBarDateRangeField = ({
  fromName,
  toName,
  label,
  timezoneMinutes,
  labels,
  quickRanges = QUICK_RANGES,
  maxMonths = TIME_RANGE_MAX_ONE_MONTHS,
  className
}: ISearchBarDateRangeFieldProps) => {
  const id = useId();
  const { control, setValue } = useFormContext<Record<string, string | undefined>>();
  const [from = '', to = ''] = useWatch({ control, name: [fromName, toName] });

  const now = new Date();
  const activeRange = quickRanges.find(kind => {
    const range = buildQuickRange(kind, now, timezoneMinutes);

    return range.from === from && range.to === to;
  });
  const isCustom = !activeRange;
  const { from: todayStart, to: todayEnd } = buildQuickRange('today', now, timezoneMinutes);
  const latestDay = buildCalendarDate(todayStart);
  const gmtLabel = buildGmtLabel(timezoneMinutes);

  const applyRange = (range: IDateTimeRange) => {
    setValue(fromName, range.from, { shouldDirty: true });
    setValue(toName, range.to, { shouldDirty: true });
  };

  const applyPickedRange = (range: IDateTimeRange) => {
    const isComplete = Boolean(range.from && range.to);
    const pickedRange = isComplete ? clampDateTimeRange(range, maxMonths, todayEnd) : range;

    applyRange(pickedRange);
  };

  const selectQuickRange = (kind: TQuickRange, event: MouseEvent<HTMLButtonElement>) => {
    const { form } = event.currentTarget;

    applyRange(buildQuickRange(kind, new Date(), timezoneMinutes));
    form?.requestSubmit();
  };

  const selectCustom = (event: MouseEvent<HTMLButtonElement>) => {
    const { form } = event.currentTarget;

    if (isCustom) return;

    applyRange(buildCustomRange(new Date(), timezoneMinutes, maxMonths));
    form?.requestSubmit();
  };

  return (
    <Field
      data-slot="search-bar-date-range-field"
      className={cn('col-span-full min-w-0 gap-0.5 @min-[52rem]:col-span-5', className)}
    >
      <div className="flex items-center gap-1.5">
        <FieldLabel htmlFor={id} className="text-xs">
          {label}
        </FieldLabel>
        <span className="rounded-full bg-primary/10 px-1.5 text-[0.625rem] leading-4 font-medium text-primary">
          {gmtLabel}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div
          role="group"
          aria-label={labels.quickRange}
          className="flex min-h-8 flex-wrap items-center gap-0.5 rounded-sm border px-0.5"
        >
          {quickRanges.map(kind => (
            <Button
              key={kind}
              type="button"
              size="xs"
              variant={activeRange === kind ? 'default' : 'ghost'}
              aria-pressed={activeRange === kind}
              onClick={event => {
                selectQuickRange(kind, event);
              }}
            >
              {labels.quickRanges[kind]}
            </Button>
          ))}
          <Button
            type="button"
            size="xs"
            variant={isCustom ? 'default' : 'ghost'}
            aria-pressed={isCustom}
            onClick={selectCustom}
          >
            {labels.custom}
          </Button>
        </div>
        <SearchBarDateRangePicker
          id={id}
          value={{ from, to }}
          onChange={applyPickedRange}
          labels={labels}
          maxDate={latestDay}
          maxMonths={maxMonths}
        />
      </div>
    </Field>
  );
};

export default SearchBarDateRangeField;
