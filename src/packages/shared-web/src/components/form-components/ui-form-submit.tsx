import { UiButton, UiButtonProps } from '../system/ui-button';
import { Spinner } from '../ui/spinner';

export type UiFormSubmitProps = Omit<UiButtonProps, 'form'> & {
    form: string;
    loading?: boolean;
};

export const UiFormSubmit = ({
    type = 'submit',
    form,
    loading,
    children,
    disabled,
    ...props
}: UiFormSubmitProps) => {
    return (
        <UiButton type={type} form={form} {...props} disabled={disabled || loading}>
            {loading ? (
                <div className='flex items-center gap-4'>
                    <Spinner data-icon='inline-start' />
                    Loading...
                </div>
            ) : (
                children
            )}
        </UiButton>
    );
};
