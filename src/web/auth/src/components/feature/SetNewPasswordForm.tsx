import { zodResolver } from '@hookform/resolvers/zod';
import { SetNewPasswordSchema } from '@org/schemas/auth';
import {
    FormTextInput,
    UiFormContainer,
    UiFormFooter,
    UiFormInputs,
    UiFormSubmit,
    useSearchParams,
    useSetNewPassword,
} from '@org/shared-web';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

const SetNewPasswordForm = () => {
    const { t } = useTranslation();
    const params = useSearchParams();
    const changeStep = () => {
        params.set({ step: String(4) });
    };
    const schema = SetNewPasswordSchema.extend({
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'password_does_not_match',
        path: ['confirmPassword'],
    });

    type FormType = z.infer<typeof schema>;
    const form = useForm<FormType>({
        mode: 'onChange',
        resolver: zodResolver(schema),
        defaultValues: {
            email: params.get('email') ?? '',
            password: '',
            confirmPassword: '',
        },
    });
    const setNewPassword = useSetNewPassword();
    const submit: SubmitHandler<FormType> = async ({ password, confirmPassword, email }) => {
        if (password === confirmPassword) {
            await setNewPassword.mutateAsync(
                { email, password },
                {
                    onSuccess() {
                        params.set({ email });
                        changeStep();
                    },
                },
            );
        }
    };
    const formId = 'set_new_password_form';
    return (
        <UiFormContainer>
            <UiFormInputs id={formId} form={form} submit={submit}>
                <FormTextInput
                    name='password'
                    type='password'
                    form={form}
                    placeholder='******************'
                />
                <FormTextInput
                    name='confirmPassword'
                    type='password'
                    form={form}
                    placeholder='******************'
                />
            </UiFormInputs>
            <UiFormFooter>
                <UiFormSubmit form={formId} className='w-full' disabled={!form.formState.isValid}>
                    {t('set_password')}
                </UiFormSubmit>
            </UiFormFooter>
        </UiFormContainer>
    );
};

export default SetNewPasswordForm;
