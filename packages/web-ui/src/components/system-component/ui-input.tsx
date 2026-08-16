import React from 'react';
import { Input } from '../ui/input';

export type UiInputProps = React.ComponentProps<'input'>;

const UiInput = ({ id, ...props }: UiInputProps) => {
    id = id ? id : props.name;
    return <Input id={id} {...props} />;
};

export default UiInput;
