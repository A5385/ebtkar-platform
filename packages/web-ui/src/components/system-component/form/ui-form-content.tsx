import { ComponentProps, ReactNode } from 'react';
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

import { cn } from '../../../lib/utils';
import { CardContent } from '../../ui/card';
import GridWrapper, { GridWrapperProps } from '../GridWrapper';

export type UiFormContentProps<T extends FieldValues> = Omit<GridWrapperProps, 'children'> & {
    form: UseFormReturn<T>;
    submit: SubmitHandler<T>;
    children?: ReactNode;
    containerClassName?: string;
    id?: string;
    formProps?: Omit<ComponentProps<'form'>, 'id' | 'children' | 'onSubmit'>;
};

const UiFormContent = <T extends FieldValues>({
    form,
    id,
    submit,
    children,
    containerClassName,
    formProps,
    className,
    ...gridProps
}: UiFormContentProps<T>) => {
    return (
        <CardContent>
            <form
                {...formProps}
                id={id}
                noValidate={formProps?.noValidate ?? true}
                onSubmit={form.handleSubmit(submit)}
                className={containerClassName}
            >
                <GridWrapper {...gridProps} className={cn('gap-6!', className)}>
                    {children}
                </GridWrapper>
            </form>
        </CardContent>
    );
};

export default UiFormContent;
