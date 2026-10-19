import { ComponentProps } from 'react';
import { Checkbox } from '../ui/checkbox';

export type UiCheckboxProps = ComponentProps<typeof Checkbox>;

export const UiCheckbox = (props: UiCheckboxProps) => {
    return <Checkbox {...props} />;
};
