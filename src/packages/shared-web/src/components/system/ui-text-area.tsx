import { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { Textarea } from '../ui/textarea';

export type UiTextAreaProps = ComponentProps<typeof Textarea>;

export const UiTextArea = ({ className, ...props }: UiTextAreaProps) => {
    return <Textarea {...props} className={cn('min-h-20 resize-y', className)} />;
};
