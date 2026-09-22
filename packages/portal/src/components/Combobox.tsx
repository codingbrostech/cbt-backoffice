import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { useDisclosure } from '~/hooks/use-disclosure';
import { cn } from '~/lib/utils';
import type { ISelectOption } from '~/table/types';

interface IComboboxBaseProps {
  id?: string;
  options: ISelectOption[];
  /**
   * Extra text matched when searching, keyed by option value.
   */
  searchText?: Record<string, string>;
  placeholder?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export interface ISingleComboboxProps extends IComboboxBaseProps {
  isMulti?: false;
  value?: string | null;
  onChange: (value: string | null) => void;
}

export interface IMultiComboboxProps extends IComboboxBaseProps {
  isMulti: true;
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

export type TComboboxProps = ISingleComboboxProps | IMultiComboboxProps;

const MAX_VISIBLE_BADGES = 2;

/**
 * Searchable select built on Command. Single by default, `isMulti` keeps the
 * popover open and toggles values.
 */
const Combobox = (props: TComboboxProps) => {
  const {
    id,
    options,
    searchText = {},
    placeholder,
    isClearable = true,
    isDisabled,
    className
  } = props;
  const { t } = useTranslation();
  const [isOpen, { open, close }] = useDisclosure();

  const selectedValues = props.isMulti ? (props.value ?? []) : props.value ? [props.value] : [];
  const selectedOptions = options.filter(option => selectedValues.includes(option.value));
  const isEmpty = selectedValues.length === 0;

  const toggle = (value: string) => {
    if (props.isMulti) {
      const next = selectedValues.includes(value)
        ? selectedValues.filter(item => item !== value)
        : [...selectedValues, value];

      props.onChange(next);
      return;
    }

    props.onChange(value === props.value ? null : value);
    close();
  };

  const clear = () => {
    if (props.isMulti) props.onChange([]);
    else props.onChange(null);
  };

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
            role="combobox"
            aria-expanded={isOpen}
            disabled={isDisabled}
            className={cn(
              'h-8 w-full justify-between px-2 font-normal',
              isEmpty && 'text-muted-foreground',
              isClearable && !isEmpty && 'pr-8'
            )}
          >
            <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
              {isEmpty && <span className="truncate">{placeholder}</span>}
              {!props.isMulti && !isEmpty && (
                <span className="truncate">{selectedOptions[0]?.label ?? props.value}</span>
              )}
              {props.isMulti &&
                selectedOptions.slice(0, MAX_VISIBLE_BADGES).map(option => (
                  <Badge key={option.value} variant="secondary" className="max-w-24 truncate">
                    {option.label}
                  </Badge>
                ))}
              {props.isMulti && selectedOptions.length > MAX_VISIBLE_BADGES && (
                <Badge variant="secondary">+{selectedOptions.length - MAX_VISIBLE_BADGES}</Badge>
              )}
            </span>
            <ChevronsUpDownIcon className="shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        {isClearable && !isEmpty && !isDisabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Clear"
            className="absolute top-1/2 right-7 -translate-y-1/2 text-muted-foreground"
            onClick={clear}
          >
            <XIcon />
          </Button>
        )}
      </div>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-48 p-0" align="start">
        <Command>
          <CommandInput placeholder={t('common.search')} className="h-8" />
          <CommandList>
            <CommandEmpty>{t('common.nothingFound')}</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = selectedValues.includes(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label, searchText[option.value] ?? '']}
                    onSelect={() => {
                      toggle(option.value);
                    }}
                  >
                    <CheckIcon className={cn('mr-1', isSelected ? 'opacity-100' : 'opacity-0')} />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
