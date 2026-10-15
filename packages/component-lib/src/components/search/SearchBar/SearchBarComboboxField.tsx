import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useId, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { ISelectOption } from '@cbt-bo/component-lib/components/forms/SelectField';
import { Field, FieldLabel } from '@cbt-bo/component-lib/components/ui/field';
import { Input } from '@cbt-bo/component-lib/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@cbt-bo/component-lib/components/ui/popover';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISearchBarComboboxFieldProps {
  name: string;
  label: string;
  options: readonly ISelectOption[];
  allLabel?: string;
  searchPlaceholder?: string;
  noResultsLabel: string;
  className?: string;
}

/**
 * Most options the list renders at once. A narrower search reaches the rest.
 */
export const COMBOBOX_OPTION_LIMIT = 100;

const ALL_OPTION_KEY = '__all__';

/**
 * Searchable select filter bound to `name` on the bar's form, exposed as
 * `SearchBar.ComboboxField`. Typing narrows the options by label, and the
 * arrow keys plus Enter pick one without the mouse.
 *
 * @example
 * <SearchBar.ComboboxField
 *   name="gameId"
 *   label="Game"
 *   options={gameOptions}
 *   allLabel="All"
 *   noResultsLabel="Nothing found"
 * />
 */
const SearchBarComboboxField = ({
  name,
  label,
  options,
  allLabel,
  searchPlaceholder,
  noResultsLabel,
  className
}: ISearchBarComboboxFieldProps) => {
  const id = useId();
  const { control } = useFormContext();
  const { field } = useController({ name, control });
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const listId = `${id}-list`;
  const value = String(field.value ?? '');
  const normalizedQuery = query.trim().toLowerCase();
  const matchedOptions = normalizedQuery
    ? options.filter(option => option.label.toLowerCase().includes(normalizedQuery))
    : options;
  const limitedOptions = matchedOptions.slice(0, COMBOBOX_OPTION_LIMIT);
  const allOptions = allLabel && !normalizedQuery ? [{ value: '', label: allLabel }] : [];
  const listedOptions = [...allOptions, ...limitedOptions];
  const selectedOption = options.find(option => option.value === value);
  const triggerLabel = selectedOption?.label ?? (value || allLabel);
  const isListEmpty = listedOptions.length === 0;

  const handleOpenChange = (isNextOpen: boolean) => {
    if (isNextOpen) {
      setQuery('');
      setActiveIndex(0);
    }
    setIsOpen(isNextOpen);
  };

  const selectOption = (optionValue: string) => {
    field.onChange(optionValue);
    setIsOpen(false);
  };

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    setActiveIndex(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(index => Math.min(index + 1, listedOptions.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(index => Math.max(index - 1, 0));
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const activeOption = listedOptions[activeIndex];

      if (activeOption) selectOption(activeOption.value);
    }
  };

  return (
    <div data-slot="search-bar-combobox-field" className={cn('min-w-0', className)}>
      <Field>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button
              id={id}
              type="button"
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={listId}
              className="flex h-8 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-3 text-left text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:border-ring dark:bg-input/30 dark:hover:bg-input/50"
              onBlur={field.onBlur}
            >
              <span className="truncate">{triggerLabel}</span>
              <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-64 p-1">
            <Input
              value={query}
              placeholder={searchPlaceholder}
              aria-controls={listId}
              className="h-8"
              onChange={event => {
                handleQueryChange(event.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
            <ul id={listId} role="listbox" className="mt-1 max-h-64 overflow-y-auto">
              {listedOptions.map((option, index) => {
                const isSelected = option.value === value;

                return (
                  <li
                    key={option.value || ALL_OPTION_KEY}
                    role="option"
                    aria-selected={isSelected}
                    data-active={index === activeIndex}
                    className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    onMouseEnter={() => {
                      setActiveIndex(index);
                    }}
                    onClick={() => {
                      selectOption(option.value);
                    }}
                  >
                    <CheckIcon
                      className={cn('size-4 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')}
                    />
                    <span className="truncate">{option.label}</span>
                  </li>
                );
              })}
            </ul>
            {isListEmpty && (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">{noResultsLabel}</p>
            )}
          </PopoverContent>
        </Popover>
      </Field>
    </div>
  );
};

export default SearchBarComboboxField;
