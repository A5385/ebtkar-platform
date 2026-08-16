import React from 'react';
import { cn } from '../../../lib/utils';
import { Card } from '../../ui/card';

export type UiFormProps = React.ComponentProps<typeof Card>;

const UiForm = ({ className, ...props }: UiFormProps) => {
    return <Card className={cn(className, 'w-full max-w-sm p-4')} {...props} />;
};

export default UiForm;
