import { ReactNode } from 'react';
import { CardFooter } from '../ui/card';
import { Field } from '../ui/field';
export type UiFormFooterProps = {
    children?: ReactNode;
    orientation?: 'vertical' | 'horizontal' | 'responsive';
    className?: string;
    contentClassName?: string;
};

export const UiFormFooter = ({
    children,
    orientation = 'horizontal',
    className,
    contentClassName,
}: UiFormFooterProps) => {
    return (
        <CardFooter className={className}>
            <Field orientation={orientation} className={contentClassName}>
                {children}
            </Field>
        </CardFooter>
    );
};
