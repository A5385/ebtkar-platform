import { UiButton, UiButtonProps } from '../system/ui-button';

export type UiFormSubmitProps = Omit<UiButtonProps, 'form'> & {
    form: string;
};

export const UiFormSubmit = ({ type = 'submit', form, ...props }: UiFormSubmitProps) => {
    return <UiButton type={type} form={form} {...props} />;
};
