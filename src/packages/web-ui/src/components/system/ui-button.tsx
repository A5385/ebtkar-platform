import { ComponentProps } from 'react';
import { Button } from '../ui/button';

export type UiButtonProps = ComponentProps<typeof Button>;

export const UiButton = ({ type = 'button', size = 'lg', ...props }: UiButtonProps) => {
    return <Button type={type} {...props} size={size} />;
};
