import React from 'react';
import { FieldDescription } from '../../ui/field';

type Props = React.ComponentProps<'p'>;

const FormDescription = (props: Props) => {
    return <FieldDescription {...props} />;
};

export default FormDescription;
