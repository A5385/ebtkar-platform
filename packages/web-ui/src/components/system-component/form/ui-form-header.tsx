import { ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { CardAction, CardDescription, CardHeader, CardTitle } from '../../ui/card';

export type UiFormHeaderProps = {
    className?: string;
    title?: ReactNode;
    titleClassName?: string;

    description?: ReactNode;
    descriptionClassName?: string;
    children?: ReactNode;
};

const UiFormHeader = ({
    className,
    title,
    titleClassName,
    description,
    descriptionClassName,
    children,
}: UiFormHeaderProps) => {
    return (
        <CardHeader className={cn('', className)}>
            {title && (
                <CardTitle
                    className={cn(
                        ' font-semibold text-2xl',
                        children ? 'text-start' : 'text-center',
                        titleClassName,
                    )}
                >
                    {title}
                </CardTitle>
            )}
            {description && (
                <CardDescription
                    className={cn(
                        ' text-sm',
                        children ? 'text-start' : 'text-center',
                        descriptionClassName,
                    )}
                >
                    {description}
                </CardDescription>
            )}
            {children && <CardAction>{children}</CardAction>}
        </CardHeader>
    );
};

export default UiFormHeader;
