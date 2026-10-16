import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useId, useRef, useState } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import FieldClearButton from '@cbt-bo/component-lib/components/forms/FieldClearButton';
import { useVisibleChips } from '@cbt-bo/component-lib/components/forms/MultiSelectField/use-visible-chips';
import {
  type ISelectOption,
  SELECT_OPTION_LIMIT
} from '@cbt-bo/component-lib/components/forms/SelectField';
import { Field, FieldError, FieldLabel } from '@cbt-bo/component-lib/components/ui/field';
import {
  Popover,
  PopoverAnchor,
  PopoverContent
} from '@cbt-bo/component-lib/components/ui/popover';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IMultiSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  options: readonly ISelectOption[];
  removeLabel: string;
  placeholder?: string;
  clearLabel?: string;
  noResultsLabel?: string;
  /**
   * Text of the badge standing in for the chips that do not fit on the line,
   * given their count. Defaults to `+<count>`.
   */
  formatHiddenCount?: (count: number) => string;
  /**
   * Most chips shown at once, whatever the room. The rest fold into the
   * badge. Without it every chip that fits shows.
   */
  maxChips?: number;
  size?: 'default' | 'sm';
  disabled?: boolean;
  className?: string;
}

interface IMultiSelectChipProps {
  label: string;
  removeLabel: string;
  /**
   * Lets the chip shrink and truncate down to CHIP_MIN_WIDTH_PX to fill the
   * line.
   */
  isShrinkable?: boolean;
  disabled?: boolean;
  /**
   * Removes the chip. Without it the chip is static, for measuring.
   */
  onRemove?: () => void;
}

/**
 * Pixels kept free for the search box after the chips.
 */
const INPUT_MIN_WIDTH_PX = 32;

/**
 * Narrowest the last shown chip shrinks to before it is folded into the
 * badge instead.
 */
const CHIP_MIN_WIDTH_PX = 48;

const ARROW_KEY_STEPS: Readonly<Record<string, number>> = {
  ArrowDown: 1,
  ArrowUp: -1
} as const;

const CHIP_CLASS =
  'inline-flex h-5 max-w-32 shrink-0 items-center rounded-sm bg-muted text-xs font-medium whitespace-nowrap';

const EMPTY_VALUES: string[] = [];

const buildHiddenCountLabel = (count: number): string => `+${count}`;

const buildPickedOptions = (
  values: readonly string[],
  options: readonly ISelectOption[]
): ISelectOption[] =>
  values.map(value => options.find(option => option.value === value) ?? { value, label: value });

const MultiSelectChip = ({
  label,
  removeLabel,
  isShrinkable = false,
  disabled,
  onRemove
}: IMultiSelectChipProps) => (
  <span
    data-slot="multi-select-chip"
    style={isShrinkable ? { minWidth: CHIP_MIN_WIDTH_PX } : undefined}
    className={cn(CHIP_CLASS, 'pl-1.5', isShrinkable && 'shrink')}
  >
    <span className="min-w-0 truncate">{label}</span>
    {onRemove ? (
      <button
        type="button"
        aria-label={`${removeLabel} ${label}`}
        disabled={disabled}
        className="flex h-full cursor-pointer items-center px-1 text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground"
        onMouseDown={event => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={onRemove}
      >
        <XIcon className="size-3" aria-hidden />
      </button>
    ) : (
      <span className="flex h-full items-center px-1">
        <XIcon className="size-3" aria-hidden />
      </span>
    )}
  </span>
);

/**
 * Searchable multi-value select bound to a string array field at the given
 * `control`/`name`. Each picked value shows as a chip with a remove button
 * before the search box, on one line. The last shown chip shrinks to fill the
 * line, and chips that do not fit, or exceed `maxChips`, fold into a badge
 * formatted by `formatHiddenCount` and listing their labels in its tooltip.
 * Typing in the box narrows the options by label, and the arrow keys plus
 * Enter toggle one without the mouse. Backspace in an empty box removes the
 * last chip. The list stays open while values are toggled. Shows the field
 * errors once the field has been touched.
 *
 * @example
 * <MultiSelectField
 *   control={form.control}
 *   name="labelIds"
 *   label="Labels"
 *   options={labelOptions}
 *   removeLabel="Remove"
 *   clearLabel="Clear"
 *   noResultsLabel="Nothing found"
 *   formatHiddenCount={count => `+${count} more`}
 * />
 */
const MultiSelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  options,
  removeLabel,
  placeholder,
  clearLabel,
  noResultsLabel,
  formatHiddenCount = buildHiddenCountLabel,
  maxChips,
  size = 'default',
  disabled,
  className
}: IMultiSelectFieldProps<TFieldValues, TName>) => {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { field, fieldState } = useController({ name, control });
  const { trackRef, measureRef, visibleCount } = useVisibleChips(
    INPUT_MIN_WIDTH_PX,
    CHIP_MIN_WIDTH_PX
  );
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const values: string[] = field.value ?? EMPTY_VALUES;
  const isInvalid = Boolean(fieldState.error);
  const normalizedQuery = query.trim().toLowerCase();
  const matchedOptions = normalizedQuery
    ? options.filter(option => option.label.toLowerCase().includes(normalizedQuery))
    : options;
  const listedOptions = matchedOptions.slice(0, SELECT_OPTION_LIMIT);
  const activeOption = listedOptions[activeIndex];
  const pickedOptions = buildPickedOptions(values, options);
  const fittingCount = visibleCount ?? pickedOptions.length;
  const visibleOptions = pickedOptions.slice(0, Math.min(fittingCount, maxChips ?? fittingCount));
  const hiddenOptions = pickedOptions.slice(visibleOptions.length);
  const hiddenLabels = hiddenOptions.map(option => option.label).join(', ');
  const isPicked = values.length > 0;
  const isListEmpty = listedOptions.length === 0;
  const isListShown = isOpen && (!isListEmpty || Boolean(noResultsLabel));
  const activeOptionId = isListShown && activeOption ? `${listId}-${activeIndex}` : undefined;
  const isClearShown = Boolean(clearLabel && isPicked && !disabled);
  const inputPlaceholder = isPicked ? undefined : placeholder;

  const open = () => {
    if (isOpen) return;

    setActiveIndex(0);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setQuery('');
  };

  const remove = (value: string) => {
    field.onChange(values.filter(picked => picked !== value));
  };

  const toggle = (value: string) => {
    const isValuePicked = values.includes(value);

    field.onChange(isValuePicked ? values.filter(picked => picked !== value) : [...values, value]);
    setQuery('');
  };

  const clear = () => {
    field.onChange([]);
  };

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    setActiveIndex(0);
    setIsOpen(true);
  };

  const moveActive = (index: number) => {
    const lastIndex = listedOptions.length - 1;
    const nextIndex = Math.max(Math.min(index, lastIndex), 0);

    setActiveIndex(nextIndex);
    listRef.current?.children.item(nextIndex)?.scrollIntoView({ block: 'nearest' });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const step = ARROW_KEY_STEPS[event.key];
    const lastValue = values.at(-1);

    if (step) {
      event.preventDefault();

      if (isOpen) moveActive(activeIndex + step);
      else open();
    }
    if (event.key === 'Enter' && isListShown) {
      event.preventDefault();

      if (activeOption) toggle(activeOption.value);
    }
    if (event.key === 'Backspace' && !query && lastValue) {
      remove(lastValue);
    }
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <div className="relative">
        <Popover
          open={isListShown}
          onOpenChange={isNextOpen => {
            if (!isNextOpen) close();
          }}
        >
          <PopoverAnchor asChild>
            <div
              data-slot="multi-select"
              data-invalid={isInvalid}
              data-disabled={disabled}
              className={cn(
                'flex w-full min-w-0 items-center rounded-sm border border-input bg-transparent pr-8 pl-2 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[invalid=true]:border-destructive dark:bg-input/30',
                size === 'sm' ? 'h-8' : 'h-9',
                !isOpen && 'cursor-text',
                className
              )}
              onMouseDown={event => {
                if (event.target === inputRef.current) return;

                event.preventDefault();
                inputRef.current?.focus();
                open();
              }}
            >
              <div
                ref={trackRef}
                data-slot="multi-select-track"
                className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden"
              >
                {visibleOptions.map((option, index) => (
                  <MultiSelectChip
                    key={option.value}
                    label={option.label}
                    removeLabel={removeLabel}
                    isShrinkable={index === visibleOptions.length - 1}
                    disabled={disabled}
                    onRemove={() => {
                      remove(option.value);
                    }}
                  />
                ))}
                {hiddenOptions.length > 0 && (
                  <span
                    data-slot="multi-select-more"
                    title={hiddenLabels}
                    className={cn(CHIP_CLASS, 'px-1.5')}
                  >
                    {formatHiddenCount(hiddenOptions.length)}
                  </span>
                )}
                <input
                  ref={inputRef}
                  id={field.name}
                  type="text"
                  role="combobox"
                  autoComplete="off"
                  spellCheck={false}
                  aria-expanded={isListShown}
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={activeOptionId}
                  aria-invalid={isInvalid}
                  value={query}
                  placeholder={inputPlaceholder}
                  disabled={disabled}
                  style={{ minWidth: INPUT_MIN_WIDTH_PX }}
                  className="h-5 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  onMouseDown={open}
                  onChange={event => {
                    handleQueryChange(event.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    field.onBlur();
                    close();
                  }}
                />
              </div>
            </div>
          </PopoverAnchor>
          <PopoverContent
            align="start"
            className="w-max max-w-(--radix-popover-content-available-width) min-w-(--radix-popover-trigger-width) p-1"
            onOpenAutoFocus={event => {
              event.preventDefault();
            }}
            onInteractOutside={event => {
              if (event.target === inputRef.current) event.preventDefault();
            }}
            onMouseDown={event => {
              event.preventDefault();
            }}
            onWheel={event => {
              event.stopPropagation();
            }}
            onTouchMove={event => {
              event.stopPropagation();
            }}
          >
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-multiselectable
              aria-label={label}
              className="max-h-64 overflow-y-auto"
            >
              {listedOptions.map((option, index) => {
                const isOptionPicked = values.includes(option.value);

                return (
                  <li
                    key={option.value}
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={isOptionPicked}
                    data-active={index === activeIndex}
                    className="relative flex cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm select-none data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    onMouseEnter={() => {
                      setActiveIndex(index);
                    }}
                    onClick={() => {
                      toggle(option.value);
                    }}
                  >
                    <span className="truncate">{option.label}</span>
                    {isOptionPicked && (
                      <CheckIcon className="absolute right-2 size-4 text-muted-foreground" />
                    )}
                  </li>
                );
              })}
            </ul>
            {isListEmpty && noResultsLabel && (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">{noResultsLabel}</p>
            )}
          </PopoverContent>
        </Popover>
        <div
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute top-0 left-0 flex gap-1"
        >
          {pickedOptions.map(option => (
            <MultiSelectChip key={option.value} label={option.label} removeLabel={removeLabel} />
          ))}
          <span className={cn(CHIP_CLASS, 'px-1.5')}>
            {formatHiddenCount(pickedOptions.length)}
          </span>
        </div>
        <ChevronDownIcon
          aria-hidden
          className={cn(
            'pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground opacity-50',
            isClearShown && 'invisible'
          )}
        />
        {isClearShown && clearLabel && (
          <FieldClearButton
            label={clearLabel}
            className="absolute top-1/2 right-3 -translate-y-1/2"
            onClick={clear}
          />
        )}
      </div>
      {isInvalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};

export default MultiSelectField;
