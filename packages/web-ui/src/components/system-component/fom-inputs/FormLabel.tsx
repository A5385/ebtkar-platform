import React from 'react';
import { FieldLabel } from '../../ui/field';

type Props = React.ComponentProps<'label'>;

const FormLabel = (props: Props) => {
    return <FieldLabel {...props} />;
};

export default FormLabel;
