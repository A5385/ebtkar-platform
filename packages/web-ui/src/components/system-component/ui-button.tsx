import { Button as ButtonPrimitive } from '@base-ui/react';
import { type VariantProps } from 'class-variance-authority';
import { Button, buttonVariants } from '../ui/button';
import { Spinner } from '../ui/spinner';

export type UiButtonProps = ButtonPrimitive.Props &
    VariantProps<typeof buttonVariants> & {
        isLoading?: boolean;
    };

const UiButton = ({
    size,
    type = 'button',
    isLoading,
    children,
    disabled,

    ...props
}: UiButtonProps) => {
    return (
        <Button type={type} disabled={isLoading || disabled} size={size ? size : 'lg'} {...props}>
            {isLoading && <Spinner data-icon='inline-start' />}
            {children}
        </Button>
    );
};

export default UiButton;
