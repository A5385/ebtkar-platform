import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { Checkbox } from '../ui/checkbox';

export type UiCheckboxProps = CheckboxPrimitive.Root.Props;

const UiCheckbox = (props: UiCheckboxProps) => {
    return <Checkbox />;
};

export default UiCheckbox;
