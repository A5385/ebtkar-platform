import { zodResolver } from '@hookform/resolvers/zod';
import { UiFormContainer } from '@org/web-ui/components/form-components/ui-form-container';
import { UiFormFooter } from '@org/web-ui/components/form-components/ui-form-footer';
import { UiFormInputs } from '@org/web-ui/components/form-components/ui-form-inputs';
import { UiFormSubmit } from '@org/web-ui/components/form-components/ui-form-submit';
import { FormTextInput } from '@org/web-ui/components/form-inputs/form-text-input';
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
