import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { UiInput, UiInputProps } from '../system/ui-input';
import { Field, FieldError, FieldLabel } from '../ui/field';

type CustomInputProps = Omit<
    UiInputProps,
    'name' | 'onChange' | 'onBlur' | 'value' | 'disabled' | 'name' | 'ref' | 'form'
>;

export type FormTextInputProps<T extends FieldValues> = CustomInputProps & {
    form: UseFormReturn<T>;
    name: Path<T>;
    label?: string;
    id?: string;
};

export const FormTextInput = <T extends FieldValues>({
    form,
    name,
    id,
    label,
    ...props
}: FormTextInputProps<T>) => {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    {label && <FieldLabel htmlFor={id ?? name}>{label}</FieldLabel>}
                    <UiInput
                        {...field}
                        id={id ?? name}
                        aria-invalid={fieldState.invalid}
                        {...props}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
};
