import { ReactNode } from 'react';
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import GridWrapper, { ColsType } from '../GridWrapper';
import { CardContent } from '../ui/card';

export type UiFormInputsProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    submit: SubmitHandler<T>;
    children?: ReactNode;
    id: string;
    className?: string;
    cols?: ColsType;
};

export const UiFormInputs = <T extends FieldValues>({
    form,
    submit,
    children,
    className,
    id,
    cols,
}: UiFormInputsProps<T>) => {
    return (
        <CardContent>
            <form id={id} noValidate onSubmit={form.handleSubmit(submit)}>
                <GridWrapper className={className} cols={cols}>
                    {children}
                </GridWrapper>
            </form>
        </CardContent>
    );
};
