import { type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '../../lib/utils';
import { buttonVariants } from '../ui/button';
import { Spinner } from '../ui/spinner';

export type UiLinkProps = React.ComponentProps<'a'> &
    VariantProps<typeof buttonVariants> & {
        isLoading?: boolean;
    };

const UiLink = ({
    size = 'sm',
    variant = 'link',
    children,
    isLoading = false,
    className,
    ...props
}: UiLinkProps) => {
    return (
        <a
            {...props}
            className={cn(
                'cursor-pointer',
                buttonVariants({
                    variant,
                    size,
                }),
                className,
            )}
        >
            {isLoading && variant !== 'link' && <Spinner data-icon='inline-start' />}

            {children}
        </a>
    );
};

export default UiLink;
