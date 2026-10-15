import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoveRightIcon,
  XIcon
} from 'lucide-react';
import { Fragment, type KeyboardEvent, type MouseEvent, useEffect, useRef, useState } from 'react';
import { type Matcher, type Modifiers, dateMatchModifiers, formatCaption } from 'react-day-picker';

import SearchBarTimeColumn from '@cbt-bo/component-lib/components/search/SearchBar/SearchBarTimeColumn';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { Calendar } from '@cbt-bo/component-lib/components/ui/calendar';
import {
  Popover,
  PopoverAnchor,
  PopoverContent
} from '@cbt-bo/component-lib/components/ui/popover';
import {
  DAY_END_TIME,
  DAY_START_TIME,
  type IDateTimeRange,
  type TLocalDateTime,
  buildCalendarDate,
  buildLocalDateTime,
  buildShiftedCalendarDate,
  buildTypedDateTime
} from '@cbt-bo/component-lib/lib/date-range';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISearchBarDateRangePickerLabels {
  /**
   * Placeholder and accessible name of the start input.
   */
  from: string;
  /**
   * Placeholder and accessible name of the end input.
   */
  to: string;
  clear: string;
  confirm: string;
  previousYear: string;
  previousMonth: string;
  nextMonth: string;
  nextYear: string;
  hour: string;
  minute: string;
}

export interface ISearchBarDateRangePickerProps {
  id?: string;
  value: IDateTimeRange;
  onChange: (range: IDateTimeRange) => void;
  labels: ISearchBarDateRangePickerLabels;
  /**
   * Last day the calendar allows. Later days are disabled.
   */
  maxDate?: Date;
  /**
   * Longest span in months between the picked days. While the end is being
   * picked, days more than `maxMonths` months after the start are disabled.
   */
  maxMonths?: number;
  className?: string;
}

type TBound = keyof IDateTimeRange;

const BOUNDS = ['from', 'to'] as const satisfies readonly TBound[];
const BOUND_DEFAULT_TIMES = {
  from: DAY_START_TIME,
  to: DAY_END_TIME
} as const satisfies Record<TBound, string>;
const MONTHS_PER_YEAR = 12;
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'));
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0'));

const buildBoundLabel = (value: TLocalDateTime): string => value.replace('T', ' ');

const buildBoundedValue = (value: TLocalDateTime, minValue: TLocalDateTime): TLocalDateTime =>
  value < minValue ? minValue : value;

const buildRangeModifiers = (
  fromDay: Date | undefined,
  toDay: Date | undefined
): Record<string, Matcher | undefined> => {
  if (!fromDay || !toDay) return { selected: fromDay ?? toDay };

  return {
    selected: { from: fromDay, to: toDay },
    range_start: fromDay,
    range_end: toDay,
    range_middle: { after: fromDay, before: toDay }
  };
};

const buildDisabledDays = (
  bound: TBound,
  fromDay: Date | undefined,
  maxDate: Date | undefined,
  maxMonths: number | undefined
): Matcher[] => {
  const spanStart = bound === 'to' ? fromDay : undefined;

  const latestMatchers = maxDate ? [{ after: maxDate }] : [];
  const startMatchers = spanStart ? [{ before: spanStart }] : [];
  const spanMatchers =
    spanStart && maxMonths ? [{ after: buildShiftedCalendarDate(spanStart, maxMonths) }] : [];

  return [...latestMatchers, ...startMatchers, ...spanMatchers];
};

const buildTypedValue = (
  text: string,
  disabledDays: Matcher[],
  minValue: TLocalDateTime
): TLocalDateTime | undefined => {
  const typedValue = buildTypedDateTime(text);

  if (!typedValue) return undefined;

  const typedDay = buildCalendarDate(typedValue);
  const isDisabled = !typedDay || dateMatchModifiers(typedDay, disabledDays);

  return isDisabled ? undefined : buildBoundedValue(typedValue, minValue);
};

/**
 * Date and time range picker for the search bar. Each bound is edited and
 * confirmed on its own, and the end can not come before the start.
 */
const SearchBarDateRangePicker = ({
  id,
  value,
  onChange,
  labels,
  maxDate,
  maxMonths,
  className
}: ISearchBarDateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBound, setActiveBound] = useState<TBound>('from');
  const [pendingValue, setPendingValue] = useState<TLocalDateTime | undefined>();
  const [typedText, setTypedText] = useState<string | undefined>();
  const [month, setMonth] = useState(() => new Date());
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<Partial<Record<TBound, HTMLInputElement | null>>>({});

  const activeValue = pendingValue ?? value[activeBound];
  const shownRange = { ...value, [activeBound]: activeValue };
  const isFilled = Boolean(value.from || value.to);
  const minValue = activeBound === 'to' ? value.from : '';
  const [activeDate = '', activeTime = ''] = activeValue.split('T');
  const [activeHour = '', activeMinute = ''] = activeTime.split(':');
  const rangeModifiers = buildRangeModifiers(
    buildCalendarDate(shownRange.from),
    buildCalendarDate(shownRange.to)
  );
  const disabledDays = buildDisabledDays(
    activeBound,
    buildCalendarDate(value.from),
    maxDate,
    maxMonths
  );
  const isTypedValid =
    typedText === undefined || Boolean(buildTypedValue(typedText, disabledDays, minValue));

  const activateBound = (bound: TBound) => {
    if (isOpen && bound === activeBound) return;

    setActiveBound(bound);
    setPendingValue(undefined);
    setTypedText(undefined);
    setMonth(buildCalendarDate(value[bound]) ?? maxDate ?? new Date());
    setIsOpen(true);
  };

  const close = () => {
    setPendingValue(undefined);
    setTypedText(undefined);
    setIsOpen(false);
  };

  const pick = (pickedValue: TLocalDateTime): TLocalDateTime => {
    const boundedValue = buildBoundedValue(pickedValue, minValue);

    setPendingValue(boundedValue);
    setTypedText(undefined);

    return boundedValue;
  };

  const confirm = (confirmedValue: TLocalDateTime) => {
    const isStartConfirmed = activeBound === 'from';

    onChange({ ...value, [activeBound]: confirmedValue });
    setPendingValue(undefined);
    setTypedText(undefined);
    setActiveBound('to');
    setIsOpen(isStartConfirmed);
  };

  const clear = () => {
    onChange({ from: '', to: '' });
    close();
  };

  const shiftMonth = (months: number) => {
    setMonth(current => buildShiftedCalendarDate(current, months));
  };

  const isHourDisabled = (hour: string): boolean => `${activeDate}T${hour}:59` < minValue;

  const isMinuteDisabled = (minute: string): boolean =>
    `${activeDate}T${activeHour}:${minute}` < minValue;

  const handleDayClick = (day: Date, _modifiers: Modifiers, { detail }: MouseEvent) => {
    const time = activeTime || BOUND_DEFAULT_TIMES[activeBound];
    const isDoubleClick = detail > 1;

    const pickedValue = pick(buildLocalDateTime(day, time));

    if (isDoubleClick) confirm(pickedValue);
  };

  const handleTextChange = (bound: TBound, text: string) => {
    const typedValue = buildTypedValue(text, disabledDays, minValue);

    activateBound(bound);
    setTypedText(text);

    if (!typedValue) return;

    setPendingValue(typedValue);
    setMonth(current => buildCalendarDate(typedValue) ?? current);
  };

  const handleTextKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || !isOpen) return;

    event.preventDefault();

    if (isTypedValid && activeValue) confirm(activeValue);
  };

  const keepOpenInsideAnchor = (event: Event) => {
    const { target } = event;
    const isInsideAnchor = target instanceof Node && anchorRef.current?.contains(target);

    if (isInsideAnchor) event.preventDefault();
  };

  useEffect(() => {
    if (isOpen) inputRefs.current[activeBound]?.focus();
  }, [activeBound, isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={close}>
      <PopoverAnchor asChild>
        <div
          ref={anchorRef}
          data-state={isOpen ? 'open' : 'closed'}
          className={cn(
            'group/range flex h-8 w-80 items-center gap-2 rounded-sm border border-input bg-background px-2.5 text-sm transition-colors hover:border-ring/60 data-[state=open]:border-ring dark:bg-input/30',
            className
          )}
        >
          {BOUNDS.map(bound => {
            const isActive = isOpen && bound === activeBound;
            const label = buildBoundLabel(shownRange[bound]);

            return (
              <Fragment key={bound}>
                {bound === 'to' && (
                  <MoveRightIcon aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
                )}
                <input
                  ref={element => {
                    inputRefs.current[bound] = element;
                  }}
                  id={bound === 'from' ? id : undefined}
                  aria-label={labels[bound]}
                  placeholder={labels[bound]}
                  autoComplete="off"
                  value={isActive ? (typedText ?? label) : label}
                  data-active={isActive}
                  className="h-full w-0 min-w-0 flex-1 border-y-2 border-transparent bg-transparent tabular-nums outline-none placeholder:text-muted-foreground data-[active=true]:border-b-primary"
                  onFocus={() => {
                    activateBound(bound);
                  }}
                  onClick={() => {
                    activateBound(bound);
                  }}
                  onChange={event => {
                    handleTextChange(bound, event.target.value);
                  }}
                  onKeyDown={handleTextKeyDown}
                  onBlur={() => {
                    setTypedText(undefined);
                  }}
                />
              </Fragment>
            );
          })}
          <span className="relative flex size-4 shrink-0 items-center justify-center">
            <CalendarIcon
              aria-hidden
              className={cn(
                'size-4 opacity-50 transition-opacity',
                isFilled && 'group-hover/range:opacity-0'
              )}
            />
            {isFilled && (
              <button
                type="button"
                aria-label={labels.clear}
                className="absolute inset-px flex items-center justify-center rounded-full bg-muted-foreground/50 text-background opacity-0 transition-[opacity,background-color] outline-none group-hover/range:opacity-100 hover:bg-muted-foreground/80 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50"
                onClick={clear}
              >
                <XIcon className="size-2.5" strokeWidth={3} />
              </button>
            )}
          </span>
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col p-0"
        onOpenAutoFocus={event => {
          event.preventDefault();
        }}
        onCloseAutoFocus={event => {
          event.preventDefault();
        }}
        onInteractOutside={keepOpenInsideAnchor}
      >
        <div className="flex">
          <div className="flex flex-col">
            <div className="flex h-10 items-center gap-0.5 border-b px-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={labels.previousYear}
                onClick={() => {
                  shiftMonth(-MONTHS_PER_YEAR);
                }}
              >
                <ChevronsLeftIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={labels.previousMonth}
                onClick={() => {
                  shiftMonth(-1);
                }}
              >
                <ChevronLeftIcon />
              </Button>
              <span aria-live="polite" className="flex-1 text-center text-sm font-medium">
                {formatCaption(month)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={labels.nextMonth}
                onClick={() => {
                  shiftMonth(1);
                }}
              >
                <ChevronRightIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={labels.nextYear}
                onClick={() => {
                  shiftMonth(MONTHS_PER_YEAR);
                }}
              >
                <ChevronsRightIcon />
              </Button>
            </div>
            <Calendar
              month={month}
              onMonthChange={setMonth}
              hideNavigation
              fixedWeeks
              className="[--cell-size:--spacing(8)]"
              modifiers={rangeModifiers}
              disabled={disabledDays}
              classNames={{ month_caption: 'hidden' }}
              onDayClick={handleDayClick}
            />
          </div>
          <div className="relative w-28 border-l">
            <div className="absolute inset-0 flex flex-col">
              <div className="flex h-10 shrink-0 items-center justify-center border-b text-sm font-medium tabular-nums">
                {activeTime}
              </div>
              <div className="flex min-h-0 flex-1 divide-x">
                <SearchBarTimeColumn
                  label={labels.hour}
                  options={HOUR_OPTIONS}
                  value={activeHour}
                  isDisabled={!activeValue}
                  isOptionDisabled={isHourDisabled}
                  onSelect={hour => {
                    pick(`${activeDate}T${hour}:${activeMinute}`);
                  }}
                />
                <SearchBarTimeColumn
                  label={labels.minute}
                  options={MINUTE_OPTIONS}
                  value={activeMinute}
                  isDisabled={!activeValue}
                  isOptionDisabled={isMinuteDisabled}
                  onSelect={minute => {
                    pick(`${activeDate}T${activeHour}:${minute}`);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t p-2">
          <Button
            type="button"
            size="xs"
            disabled={!activeValue}
            onClick={() => {
              confirm(activeValue);
            }}
          >
            {labels.confirm}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBarDateRangePicker;
