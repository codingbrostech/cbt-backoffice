import { createFormHook } from '@tanstack/react-form';

import FormShell from '~/forms/FormShell';
import SubmitButton from '~/forms/SubmitButton';
import CheckboxField from '~/forms/fields/CheckboxField';
import ComboboxField from '~/forms/fields/ComboboxField';
import DateTimeField from '~/forms/fields/DateTimeField';
import ExpressionField from '~/forms/fields/ExpressionField';
import ImagesField from '~/forms/fields/ImagesField';
import LocaleValuesField from '~/forms/fields/LocaleValuesField';
import MultiSelectField from '~/forms/fields/MultiSelectField';
import NumberField from '~/forms/fields/NumberField';
import PasswordField from '~/forms/fields/PasswordField';
import RichTextField from '~/forms/fields/RichTextField';
import RichTextLocaleValuesField from '~/forms/fields/RichTextLocaleValuesField';
import SelectField from '~/forms/fields/SelectField';
import SwitchField from '~/forms/fields/SwitchField';
import TextField from '~/forms/fields/TextField';
import TextareaField from '~/forms/fields/TextareaField';
import { fieldContext, formContext } from '~/forms/form-context';

/**
 * Portal form hook with the shared field and form components registered.
 *
 * @example
 * const form = useAppForm({ defaultValues: { name: '' }, onSubmit: ({ value }) => save(value) });
 * <form.AppField name="name">{field => <field.TextField label="Name" />}</form.AppField>
 */
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
    SelectField,
    ComboboxField,
    MultiSelectField,
    TextareaField,
    NumberField,
    SwitchField,
    CheckboxField,
    DateTimeField,
    ExpressionField,
    RichTextField,
    LocaleValuesField,
    RichTextLocaleValuesField,
    ImagesField
  },
  formComponents: { SubmitButton, FormShell }
});
