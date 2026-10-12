import { useCallback, useState } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

import PasswordToggle from '@cbt-bo/component-lib/components/forms/PasswordToggle';
import TextField, { type ITextFieldProps } from '@cbt-bo/component-lib/components/forms/TextField';

export interface IPasswordFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ITextFieldProps<TFieldValues, TName>, 'type' | 'suffix'> {
  /**
   * Accessible name of the toggle while the password is hidden.
   */
  showLabel?: string;
  /**
   * Accessible name of the toggle while the password is shown.
   */
  hideLabel?: string;
}

/**
 * Password input bound to the given `control`/`name`, with a visibility
 * toggle at its end.
 */
const PasswordField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  disabled,
  showLabel,
  hideLabel,
  ...props
}: IPasswordFieldProps<TFieldValues, TName>) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return (
    <TextField<TFieldValues, TName>
      type={isVisible ? 'text' : 'password'}
      disabled={disabled}
      suffix={
        <PasswordToggle
          isVisible={isVisible}
          disabled={disabled}
          showLabel={showLabel}
          hideLabel={hideLabel}
          onToggle={toggleVisibility}
        />
      }
      {...props}
    />
  );
};

export default PasswordField;
