import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

import { Field, FieldError } from '../../ui/field';
import UiButton from '../ui-button';
import UiInput, { UiInputProps } from '../ui-input';
import FormDescription from './FormDescription';
import FormLabel from './FormLabel';

export type FormInputProps<T extends FieldValues> = Omit<
    UiInputProps,
    'onChange' | 'onBlur' | 'value' | 'disabled' | 'name' | 'ref' | 'aria-invalid' | 'form'
> & {
    form: UseFormReturn<T>;
    desc?: string;
    label?: string;
    name: Path<T>;
};

const FormInput = <T extends FieldValues>({
    form,
    name,
    desc,
    label,
    id,
    type,
    ...props
}: FormInputProps<T>) => {
    const [passwordType, setPasswordType] = useState<'password' | 'text'>('password');

    const inputId = id ?? name;
    const isNumeric = type === 'number';
    const isPassword = type === 'password';

    const finalType = isPassword ? passwordType : isNumeric ? 'text' : type;

    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => {
                const { value, onChange, ...fieldProps } = field;

                const inputFinalProps: UiInputProps = {
                    ...fieldProps,
                    ...props,
                    id: inputId,
                    type: finalType,
                    disabled: form.formState.isSubmitting || form.formState.isLoading,
                    value: value ?? '',
                    'aria-invalid': fieldState.invalid,
                    inputMode: isNumeric ? 'decimal' : props.inputMode,

                    onChange: (event) => {
                        const inputValue = event.target.value;

                        if (!isNumeric) {
                            onChange(inputValue);
                            return;
                        }

                        onChange(inputValue === '' ? undefined : Number(inputValue));
                    },
                };

                return (
                    <Field data-invalid={fieldState.invalid}>
                        {label && <FormLabel htmlFor={inputId}>{label}</FormLabel>}

                        {isPassword ? (
                            <div className='relative'>
                                <UiInput
                                    {...inputFinalProps}
                                    className={`pe-12 ${props.className ?? ''}`}
                                />

                                <UiButton
                                    type='button'
                                    variant='ghost'
                                    aria-label={
                                        passwordType === 'password'
                                            ? 'Show password'
                                            : 'Hide password'
                                    }
                                    aria-pressed={passwordType === 'text'}
                                    onClick={() =>
                                        setPasswordType((currentType) =>
                                            currentType === 'password' ? 'text' : 'password',
                                        )
                                    }
                                    className='absolute inset-e-2 top-1/2 -translate-y-1/2 cursor-pointer'
                                >
                                    {passwordType === 'text' ? <EyeOffIcon /> : <EyeIcon />}
                                </UiButton>
                            </div>
                        ) : (
                            <UiInput {...inputFinalProps} />
                        )}

                        {desc && <FormDescription>{desc}</FormDescription>}

                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                );
            }}
        />
    );
};

export default FormInput;
