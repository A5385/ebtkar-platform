import { RotateCcwIcon } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { CardFooter } from '../../ui/card';
import UiButton, { UiButtonProps } from '../ui-button';

export type UiFormFooterProps = {
    id?: string;
    className?: string;
    submitTitle?: React.ReactNode;
    resetFn?: UiButtonProps['onClick'];
    isLoading?: boolean;
    disabled?: boolean;
};

const UiFormFooter = ({
    id,
    submitTitle = 'Submit',
    resetFn,
    isLoading = false,
    disabled,
    className,
}: UiFormFooterProps) => {
    return (
        <CardFooter className={cn('flex items-center gap-4 py-6 ', className)}>
            {resetFn && (
                <UiButton
                    type='button'
                    size={'icon-lg'}
                    variant='outline'
                    aria-label='Reset form'
                    onClick={resetFn}
                    disabled={isLoading || disabled}
                    isLoading={isLoading || disabled}
                    className='cursor-pointer'
                >
                    <RotateCcwIcon />
                </UiButton>
            )}

            <UiButton
                type='submit'
                form={id}
                disabled={isLoading || disabled}
                isLoading={isLoading || disabled}
                className='cursor-pointer flex-1'
            >
                {submitTitle}
            </UiButton>
        </CardFooter>
    );
};

export default UiFormFooter;
