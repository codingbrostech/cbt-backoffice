import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useId, useRef, useState } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import FieldClearButton from '@cbt-bo/component-lib/components/forms/FieldClearButton';
import { Field, FieldError, FieldLabel } from '@cbt-bo/component-lib/components/ui/field';
import { Input } from '@cbt-bo/component-lib/components/ui/input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent
} from '@cbt-bo/component-lib/components/ui/popover';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISelectOption {
  value: string;
  label: string;
}

export interface ISelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  options: readonly ISelectOption[];
  placeholder?: string;
  emptyLabel?: string;
  clearLabel?: string;
  noResultsLabel?: string;
  size?: 'default' | 'sm';
  disabled?: boolean;
  className?: string;
}

/**
 * Most options the list renders at once. A narrower search reaches the rest.
 */
export const SELECT_OPTION_LIMIT = 100;

const EMPTY_OPTION_KEY = '__empty__';

const ARROW_KEY_STEPS: Readonly<Record<string, number>> = {
  ArrowDown: 1,
  ArrowUp: -1
} as const;

/**
 * Searchable select bound to a string field at the given `control`/`name`.
 * Typing in the field narrows the options by label, and the arrow keys plus
 * Enter pick one without the mouse. An empty value shows `emptyLabel` when
 * given and `placeholder` otherwise, and a picked value shows a clear button
 * when `clearLabel` is given. Shows the field errors once the field has been
 * touched.
 *
 * @example
 * <SelectField
 *   control={form.control}
 *   name="gameId"
 *   label="Game"
 *   options={gameOptions}
 *   clearLabel="Clear"
 *   noResultsLabel="Nothing found"
 * />
 */
const SelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  options,
  placeholder,
  emptyLabel,
  clearLabel,
  noResultsLabel,
  size = 'default',
  disabled,
  className
}: ISelectFieldProps<TFieldValues, TName>) => {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { field, fieldState } = useController({ name, control });
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const value: string = field.value ?? '';
  const isInvalid = Boolean(fieldState.error);
  const normalizedQuery = query.trim().toLowerCase();
  const matchedOptions = normalizedQuery
    ? options.filter(option => option.label.toLowerCase().includes(normalizedQuery))
    : options;
  const limitedOptions = matchedOptions.slice(0, SELECT_OPTION_LIMIT);
  const emptyOptions = emptyLabel && !normalizedQuery ? [{ value: '', label: emptyLabel }] : [];
  const listedOptions = [...emptyOptions, ...limitedOptions];
  const activeOption = listedOptions[activeIndex];
  const selectedOption = options.find(option => option.value === value);
  const selectedLabel = selectedOption?.label ?? (value || emptyLabel) ?? '';
  const inputValue = isOpen ? query : selectedLabel;
  const inputPlaceholder = isOpen && selectedLabel ? selectedLabel : placeholder;
  const isListEmpty = listedOptions.length === 0;
  const isListShown = isOpen && (!isListEmpty || Boolean(noResultsLabel));
  const activeOptionId = isListShown && activeOption ? `${listId}-${activeIndex}` : undefined;
  const isClearShown = Boolean(clearLabel && value && !disabled);

  const open = () => {
    if (isOpen) return;

    const selectedIndex = listedOptions.findIndex(option => option.value === value);

    setActiveIndex(Math.max(selectedIndex, 0));
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setQuery('');
  };

  const selectOption = (optionValue: string) => {
    field.onChange(optionValue);
    close();
  };

  const clear = () => {
    field.onChange('');
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

    if (step) {
      event.preventDefault();

      if (isOpen) moveActive(activeIndex + step);
      else open();
    }
    if (event.key === 'Enter' && isListShown) {
      event.preventDefault();

      if (activeOption) selectOption(activeOption.value);
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
            <Input
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
              value={inputValue}
              placeholder={inputPlaceholder}
              disabled={disabled}
              className={cn(
                'truncate pr-8 focus-visible:ring-0',
                size === 'sm' ? 'h-8' : 'h-9',
                !isOpen && 'cursor-pointer',
                className
              )}
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
          </PopoverAnchor>
          <PopoverContent
            align="start"
            className="w-(--radix-popover-trigger-width) min-w-64 p-1"
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
              aria-label={label}
              className="max-h-64 overflow-y-auto"
            >
              {listedOptions.map((option, index) => {
                const isSelected = option.value === value;

                return (
                  <li
                    key={option.value || EMPTY_OPTION_KEY}
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    data-active={index === activeIndex}
                    className="relative flex cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm select-none data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    onMouseEnter={() => {
                      setActiveIndex(index);
                    }}
                    onClick={() => {
                      selectOption(option.value);
                    }}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
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

export default SelectField;
