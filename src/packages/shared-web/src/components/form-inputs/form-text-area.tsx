import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { UiTextArea, UiTextAreaProps } from '../system/ui-text-area';
import { Field, FieldLabel } from '../ui/field';
import { FormErrorMessage } from './error-message';

type CustomTextProps = Omit<
    UiTextAreaProps,
    'name' | 'onChange' | 'onBlur' | 'value' | 'disabled' | 'name' | 'ref' | 'form'
>;

export type FormTextAreaProps<T extends FieldValues> = CustomTextProps & {
    form: UseFormReturn<T>;
    name: Path<T>;
    label?: string;
    id?: string;
};

export const FormTextArea = <T extends FieldValues>({
    form,
    name,
    id,
    label,
    ...props
}: FormTextAreaProps<T>) => {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    {label && <FieldLabel htmlFor={id ?? name}>{label}</FieldLabel>}
                    <UiTextArea
                        {...field}
                        id={id ?? name}
                        aria-invalid={fieldState.invalid}
                        {...props}
                    />
                    <FormErrorMessage message={fieldState.error?.message} />
                </Field>
            )}
        />
    );
};
