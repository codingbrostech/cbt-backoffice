import Combobox from '~/components/Combobox';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';
import type { ISelectOption } from '~/table/types';

export interface IEditableSelectProps {
  id: string;
  label?: string;
  options: ISelectOption[];
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  /**
   * Text shown while not editing. Defaults to the value.
   */
  readOnlyValue?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isChanged?: boolean;
  className?: string;
}

/**
 * Combobox while editing, read-only input otherwise.
 */
const EditableSelect = ({
  id,
  label,
  options,
  value,
  onChange,
  isEditing,
  readOnlyValue,
  isDisabled,
  isInvalid,
  isChanged,
  className
}: IEditableSelectProps) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    {label && <Label htmlFor={id}>{label}</Label>}
    {isEditing ? (
      <Combobox
        id={id}
        options={options}
        value={value || null}
        isDisabled={isDisabled}
        isClearable={false}
        className={cn(isInvalid && 'border-destructive', isChanged && 'border-amber-400')}
        onChange={next => {
          if (next) onChange(next);
        }}
      />
    ) : (
      <Input id={id} value={readOnlyValue ?? value} readOnly />
    )}
  </div>
);

export default EditableSelect;
