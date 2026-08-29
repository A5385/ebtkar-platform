import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

export type UiFormProps = {
    className?: string;
    title?: string;
    description?: string;
    children?: ReactNode;
};

export const UiFormContainer = ({ className, children, title, description }: UiFormProps) => {
    const hasHeader = Boolean(title || description);

    return (
        <Card className={cn('w-full sm:max-w-md', className)}>
            {hasHeader && (
                <CardHeader className='flex w-full flex-col items-center justify-center px-4 text-center'>
                    {title && <CardTitle className='text-2xl font-semibold'>{title}</CardTitle>}

                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            )}

            {children}
        </Card>
    );
};
