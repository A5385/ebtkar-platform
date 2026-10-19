import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { UiCheckboxGroup, UiCheckboxGroupProps } from '../system';
import { Field } from '../ui/field';
import { FormErrorMessage } from './error-message';

type CustomMultiSelectProps<T extends string | number> = Omit<
    UiCheckboxGroupProps<T>,
    'value' | 'onValueChange' | 'name'
>;

export type FormGroupCheckboxProps<
    T extends FieldValues,
    V extends string | number,
> = CustomMultiSelectProps<V> & {
    form: UseFormReturn<T>;
    name: Path<T>;
};

export const FormGroupCheckbox = <T extends FieldValues, V extends string | number>({
    form,
    name,
    ...props
}: FormGroupCheckboxProps<T, V>) => {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <UiCheckboxGroup<V>
                        {...props}
                        name={field.name}
                        value={Array.isArray(field.value) ? (field.value as V[]) : []}
                        onValueChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                    />

                    <FormErrorMessage message={fieldState.error?.message} />
                </Field>
            )}
        />
    );
};
