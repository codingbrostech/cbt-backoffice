import dayjs from 'dayjs';
import { CalendarIcon, XIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Input } from '~/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { useDisclosure } from '~/hooks/use-disclosure';
import { cn } from '~/lib/utils';
import { type DateType, convertToDateParam } from '~/utils/date';

export type TDateTimePickerMode = 'datetime' | 'date' | 'month';

export interface IDateTimePickerProps {
  id?: string;
  /**
   * Current value as any dayjs input. Emitted values are ISO strings for
   * `datetime`, `YYYY-MM-DD` for `date` and `YYYY-MM` for `month`.
   */
  value?: DateType | null;
  onChange: (value: string | null) => void;
  mode?: TDateTimePickerMode;
  minDate?: DateType;
  maxDate?: DateType;
  placeholder?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  className?: string;
}

const DISPLAY_FORMATS = {
  datetime: 'YYYY-MM-DD HH:mm:ss',
  date: 'YYYY-MM-DD',
  month: 'YYYY-MM'
} as const satisfies Record<TDateTimePickerMode, string>;

const TIME_FORMAT = 'HH:mm:ss';

const toValidDate = (value?: DateType | null): Date | undefined => {
  if (value === null || value === undefined || value === '') return undefined;

  const parsed = dayjs(value);

  return parsed.isValid() ? parsed.toDate() : undefined;
};

const buildOutput = (date: Date, mode: TDateTimePickerMode): string => {
  if (mode === 'datetime') return convertToDateParam(date);

  return dayjs(date).format(DISPLAY_FORMATS[mode]);
};

/**
 * Calendar popover with an optional time field. Date picks keep the time
 * already entered, or midnight when there is none.
 */
const DateTimePicker = ({
  id,
  value,
  onChange,
  mode = 'datetime',
  minDate,
  maxDate,
  placeholder,
  isClearable = true,
  isDisabled = false,
  className
}: IDateTimePickerProps) => {
  const [isOpen, { open, close }] = useDisclosure();

  const selected = toValidDate(value);
  const minBound = toValidDate(minDate);
  const maxBound = toValidDate(maxDate);
  const displayValue = selected ? dayjs(selected).format(DISPLAY_FORMATS[mode]) : '';
  const timeValue = selected ? dayjs(selected).format(TIME_FORMAT) : '';

  const emit = (date: Date | undefined) => {
    onChange(date ? buildOutput(date, mode) : null);
  };

  const selectDate = (date: Date | undefined) => {
    if (!date) return;

    const base = dayjs(date);
    const withTime = selected
      ? base.hour(selected.getHours()).minute(selected.getMinutes()).second(selected.getSeconds())
      : base.startOf('day');

    emit(withTime.toDate());
    if (mode !== 'datetime') close();
  };

  const selectTime = (time: string) => {
    if (!selected || !time) return;

    const [hours = 0, minutes = 0, seconds = 0] = time.split(':').map(Number);

    emit(dayjs(selected).hour(hours).minute(minutes).second(seconds).toDate());
  };

  if (mode === 'month') {
    return (
      <Input
        id={id}
        type="month"
        className={cn('h-8', className)}
        value={displayValue}
        disabled={isDisabled}
        min={minBound ? dayjs(minBound).format(DISPLAY_FORMATS.month) : undefined}
        max={maxBound ? dayjs(maxBound).format(DISPLAY_FORMATS.month) : undefined}
        onChange={event => {
          onChange(event.target.value || null);
        }}
      />
    );
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={isNextOpen => {
        if (isNextOpen) open();
        else close();
      }}
    >
      <div className={cn('relative', className)}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={isDisabled}
            className={cn(
              'h-8 w-full justify-start px-2 font-normal',
              !displayValue && 'text-muted-foreground',
              isClearable && displayValue && 'pr-8'
            )}
          >
            <CalendarIcon className="text-muted-foreground" />
            <span className="truncate">{displayValue || placeholder}</span>
          </Button>
        </PopoverTrigger>
        {isClearable && displayValue && !isDisabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Clear"
            className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
            onClick={() => {
              emit(undefined);
            }}
          >
            <XIcon />
          </Button>
        )}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected ?? maxBound}
          disabled={[
            ...(minBound ? [{ before: minBound }] : []),
            ...(maxBound ? [{ after: maxBound }] : [])
          ]}
          captionLayout="dropdown"
          onSelect={selectDate}
        />
        {mode === 'datetime' && (
          <div className="border-t p-2">
            <Input
              type="time"
              step={1}
              className="h-8"
              value={timeValue}
              disabled={!selected}
              onChange={event => {
                selectTime(event.target.value);
              }}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
