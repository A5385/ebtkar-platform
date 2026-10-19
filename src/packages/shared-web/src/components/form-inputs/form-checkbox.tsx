import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { UiCheckbox, UiCheckboxProps } from '../system';
import { Field, FieldLabel } from '../ui/field';
import { FormErrorMessage } from './error-message';

type CustomTextProps = Omit<
    UiCheckboxProps,
    'name' | 'onChange' | 'onBlur' | 'value' | 'disabled' | 'name' | 'ref' | 'form'
>;

export type FormCheckboxProps<T extends FieldValues> = CustomTextProps & {
    form: UseFormReturn<T>;
    name: Path<T>;
    label?: string;
    id?: string;
};

export const FormCheckbox = <T extends FieldValues>({
    form,
    name,
    id,
    label,
    ...props
}: FormCheckboxProps<T>) => {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <div className='flex gap-2 items-center'>
                        <UiCheckbox
                            {...props}
                            id={id ?? name}
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                            onBlur={field.onBlur}
                            aria-invalid={fieldState.invalid}
                        />
                        {label && <FieldLabel htmlFor={id ?? name}>{label}</FieldLabel>}
                    </div>
                    <FormErrorMessage message={fieldState.error?.message} />
                </Field>
            )}
        />
    );
};
