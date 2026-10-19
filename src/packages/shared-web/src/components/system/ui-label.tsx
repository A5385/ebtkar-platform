import { ComponentProps } from 'react';
import { Label } from '../ui/label';

type Props = ComponentProps<typeof Label>;

export const UiLabel = (props: Props) => {
    return <Label {...props} />;
};
