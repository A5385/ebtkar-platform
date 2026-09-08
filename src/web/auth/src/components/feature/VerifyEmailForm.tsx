import { zodResolver } from '@hookform/resolvers/zod';
import type { CheckEmailSchemaFormType } from '@org/schemas/auth';
import { CheckEmailSchema } from '@org/schemas/auth';
import {
    FormTextInput,
    UiButton,
    UiFormContainer,
    UiFormFooter,
    UiFormInputs,
    UiFormSubmit,
    useCheckEmail,
    useSearchParams,
} from '@org/shared-web';
import { useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const VerifyEmailForm = () => {
    const [valid, setValid] = useState<boolean>(false);

    const { t } = useTranslation();
    const params = useSearchParams();
    const changeStep = () => {
        params.set({ step: String(2) });
    };

    const form = useForm<CheckEmailSchemaFormType>({
        mode: 'onChange',
        resolver: zodResolver(CheckEmailSchema),
        defaultValues: {
            email: params.get('email') ?? '',
        },
    });
    const watchEmail = useWatch({ control: form.control, name: 'email' });

    const check = useCheckEmail();

    const handleCheckEmail = form.handleSubmit(async ({ email }) => {
        setValid(false);
        await check.mutateAsync(
            { email: watchEmail },
            {
                onSuccess(data) {
                    setValid(data.available);
                },
            },
        );
    });

    const submit: SubmitHandler<CheckEmailSchemaFormType> = async (data) => {
        alert(JSON.stringify(data, null, 2));
        changeStep();
    };
    const formId = 'verify-email-form';
    return (
        <UiFormContainer>
            <UiFormInputs id={formId} form={form} submit={submit}>
                <div className='flex items-center gap-2'>
                    <FormTextInput
                        name='email'
                        type='email'
                        form={form}
                        placeholder='user@domain.com'
                    />
                    <UiButton onClick={handleCheckEmail} variant='link' disabled={check.isPending}>
                        verify
                    </UiButton>
                </div>
            </UiFormInputs>
            <UiFormFooter>
                <UiFormSubmit form={formId} className='w-full' disabled={!valid}>
                    {t('create_account')}
                </UiFormSubmit>
            </UiFormFooter>
        </UiFormContainer>
    );
};

export default VerifyEmailForm;
