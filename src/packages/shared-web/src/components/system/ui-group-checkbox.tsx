import { useId } from 'react';
import { Checkbox } from '../ui/checkbox';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '../ui/field';

export type CheckboxGroupOption<T extends string | number> = {
    value: T;
    label: string;
    disabled?: boolean;
};

export type UiCheckboxGroupProps<T extends string | number> = {
    options: CheckboxGroupOption<T>[];
    value: T[];
    onValueChange: (value: T[]) => void;
    label?: string;
    description?: string;
    name?: string;
    id?: string;
    disabled?: boolean;
    className?: string;
};

export const UiCheckboxGroup = <T extends string | number>({
    options,
    value,
    onValueChange,
    label,
    description,
    name,
    id,
    disabled = false,
    className,
}: UiCheckboxGroupProps<T>) => {
    const generatedId = useId();
    const groupId = id ?? generatedId;

    const handleCheckedChange = (optionValue: T, checked: boolean | 'indeterminate') => {
        if (checked === true) {
            if (!value.includes(optionValue)) {
                onValueChange([...value, optionValue]);
            }
            return;
        }

        onValueChange(value.filter((item) => item !== optionValue));
    };

    return (
        <FieldSet>
            {label && <FieldLegend variant='label'>{label}</FieldLegend>}

            {description && <FieldDescription>{description}</FieldDescription>}

            <FieldGroup className={className ?? 'gap-3'}>
                {options.map((option, index) => {
                    const checkboxId = `${groupId}-${index}`;

                    return (
                        <Field key={String(option.value)} orientation='horizontal'>
                            <Checkbox
                                id={checkboxId}
                                name={name}
                                checked={value.includes(option.value)}
                                disabled={disabled || option.disabled}
                                onCheckedChange={(checked) =>
                                    handleCheckedChange(option.value, checked)
                                }
                            />

                            <FieldLabel htmlFor={checkboxId} className='font-normal'>
                                {option.label}
                            </FieldLabel>
                        </Field>
                    );
                })}
            </FieldGroup>
        </FieldSet>
    );
};
