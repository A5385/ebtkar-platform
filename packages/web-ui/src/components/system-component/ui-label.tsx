import React from 'react';
import { Label } from '../ui/label';

export type UiLabelProps = React.ComponentProps<'label'>;

const UiLabel = (props: UiLabelProps) => {
    return <Label {...props} />;
};

export default UiLabel;
