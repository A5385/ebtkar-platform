import { zodResolver } from '@hookform/resolvers/zod';
import { VerifyEmailSchema, VerifyEmailSchemaFormType } from '@org/schemas/auth';
import {
    FormTextInput,
    UiFormContainer,
    UiFormFooter,
    UiFormInputs,
    UiFormSubmit,
    useSearchParams,
    useVerifyEmailOtp,
} from '@org/shared-web';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const VerifyOtpForm = () => {
    const { t } = useTranslation();
    const params = useSearchParams();
    const changeStep = () => {
        params.set({ step: String(3) });
    };

    const form = useForm<VerifyEmailSchemaFormType>({
        mode: 'onChange',
        resolver: zodResolver(VerifyEmailSchema),
        defaultValues: {
            email: params.get('email') ?? '',
            otp: 0,
        },
    });

    const verify = useVerifyEmailOtp();
    const submit: SubmitHandler<VerifyEmailSchemaFormType> = async (data) =>
        await verify.mutateAsync(
            { ...data },
            {
                onSuccess() {
                    params.set({ email: data.email });
                    changeStep();
                },
            },
        );
    const formId = 'verify-email-otp-form';
    return (
        <UiFormContainer>
            <UiFormInputs id={formId} form={form} submit={submit}>
                <FormTextInput name='otp' type='number' form={form} placeholder='user@domain.com' />
            </UiFormInputs>
            <UiFormFooter>
                <UiFormSubmit form={formId} className='w-full'>
                    {t('verify_otp')}
                </UiFormSubmit>
            </UiFormFooter>
        </UiFormContainer>
    );
};

export default VerifyOtpForm;
