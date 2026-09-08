import { zodResolver } from '@hookform/resolvers/zod';
import {
    FormTextInput,
    UiFormContainer,
    UiFormFooter,
    UiFormInputs,
    UiFormSubmit,
} from '@org/shared-web';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

const LoginForm = () => {
    const { t } = useTranslation();

    const schema = z.object({
        email: z.email(),
        password: z.string(),
        number: z.number(),
    });
    type FormType = z.infer<typeof schema>;
    const form = useForm<FormType>({
        mode: 'onChange',
        resolver: zodResolver(schema),
        defaultValues: { email: '', password: '', number: 0 },
    });

    const submit: SubmitHandler<FormType> = (data) => {
        alert(JSON.stringify(data, null, 2));
    };

    const formId = 'login-form';
    return (
        <UiFormContainer title={t('login')}>
            <UiFormInputs form={form} submit={submit} id={formId}>
                <FormTextInput
                    form={form}
                    type='email'
                    name='email'
                    label={t('email')}
                    placeholder='user@domain.com'
                />
                <FormTextInput
                    form={form}
                    type='password'
                    name='password'
                    label={t('password')}
                    placeholder='********'
                />

                <input />
            </UiFormInputs>
            <UiFormFooter>
                <UiFormSubmit form={formId} className={'w-full'}>
                    {t('login')}
                </UiFormSubmit>
            </UiFormFooter>
        </UiFormContainer>
    );
};

export default LoginForm;
