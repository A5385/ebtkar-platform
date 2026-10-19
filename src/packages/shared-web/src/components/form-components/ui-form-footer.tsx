import { ReactNode } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CardFooter } from '../ui/card';
import { Field } from '../ui/field';
export type UiFormFooterProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    children?: ReactNode;
    orientation?: 'vertical' | 'horizontal' | 'responsive';
    className?: string;
    contentClassName?: string;
};

export const UiFormFooter = <T extends FieldValues>({
    form,
    children,
    orientation = 'horizontal',
    className,
    contentClassName,
}: UiFormFooterProps<T>) => {
    const { t } = useTranslation();
    const { isValid, errors } = form.formState;

    const invalidFields = Object.keys(errors);
    return (
        <CardFooter className={className}>
            <Field orientation={orientation} className={contentClassName}>
                {children}

                {!isValid && (
                    <div className='text-sm text-muted-foreground'>
                        <p>{t('complete_required_fields')}</p>

                        <ul className='list-disc pl-5'>
                            {invalidFields.map((field) => (
                                <li key={field}>{t(field)}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </Field>
        </CardFooter>
    );
};
