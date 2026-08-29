import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { ComponentProps, useState } from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { UiButton } from './ui-button';

type InputProps = ComponentProps<typeof Input>;

export type UiInputProps = Omit<InputProps, 'value' | 'onChange'> & {
    value?: string | number;
    onChange?: InputProps['onChange'] | ((value: number | undefined) => void);
    allowDecimal?: boolean;
    allowNegative?: boolean;
};

export const UiInput = ({
    className,
    type,
    value,
    onChange,
    allowDecimal = true,
    allowNegative = false,
    disabled,
    ...props
}: UiInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const [numberText, setNumberText] = useState(value === undefined ? '' : String(value));

    const style = cn('h-10', className);

    if (type === 'password') {
        const handleChange = onChange as InputProps['onChange'];

        return (
            <div className='relative w-full'>
                <Input
                    {...props}
                    type={showPassword ? 'text' : 'password'}
                    value={value ?? ''}
                    onChange={handleChange}
                    disabled={disabled}
                    className={cn(style, 'pe-11')}
                />

                <div className='absolute inset-y-0 end-1 flex items-center'>
                    <UiButton
                        type='button'
                        variant='ghost'
                        size='icon-sm'
                        disabled={disabled}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                            setShowPassword((current) => !current);
                        }}
                    >
                        {showPassword ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
                    </UiButton>
                </div>
            </div>
        );
    }

    if (type === 'number') {
        const numberOnChange = onChange as ((value: number | undefined) => void) | undefined;

        const pattern = allowDecimal
            ? allowNegative
                ? /^-?\d*(?:\.\d*)?$/
                : /^\d*(?:\.\d*)?$/
            : allowNegative
              ? /^-?\d*$/
              : /^\d*$/;

        return (
            <Input
                {...props}
                type='text'
                inputMode={allowDecimal ? 'decimal' : 'numeric'}
                value={numberText}
                disabled={disabled}
                className={style}
                onChange={(event) => {
                    const nextValue = event.currentTarget.value;

                    // Prevent anything except the configured number format.
                    if (!pattern.test(nextValue)) return;

                    setNumberText(nextValue);

                    if (
                        nextValue === '' ||
                        nextValue === '-' ||
                        nextValue === '.' ||
                        nextValue === '-.'
                    ) {
                        numberOnChange?.(undefined);
                        return;
                    }

                    numberOnChange?.(Number(nextValue));
                }}
            />
        );
    }

    const nativeOnChange = onChange as InputProps['onChange'];

    return (
        <Input
            {...props}
            type={type}
            value={value}
            onChange={nativeOnChange}
            disabled={disabled}
            className={style}
        />
    );
};
