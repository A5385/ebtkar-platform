import { zodResolver } from '@hookform/resolvers/zod';
import { NetworkSettingsFormType, networkSettingsSchema } from '@org/schemas/admin';
import {
    FormGroupCheckbox,
    FormTextInput,
    Spinner,
    UiFormContainer,
    UiFormFooter,
    UiFormInputs,
    UiFormSubmit,
    useGetNetwork,
    useUpdateNetwork,
} from '@org/shared-web';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const statusCode = [408, 409, 425, 429, 500, 502, 503, 504];
const NetworkForm = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useGetNetwork();

    const getDefaultValues = (data?: NetworkSettingsFormType): NetworkSettingsFormType => ({
        retryDelay: data?.retryDelay ?? 2000,
        httpClientRetries: data?.httpClientRetries ?? 3,
        requestTimeoutMs: data?.requestTimeoutMs ?? 30000,
        paginationPageSize: data?.paginationPageSize ?? 10,
        retryStatusCodes: data?.retryStatusCodes ?? statusCode,
    });

    const form = useForm<NetworkSettingsFormType>({
        mode: 'onChange',
        resolver: zodResolver(networkSettingsSchema),
        defaultValues: getDefaultValues(data),
    });

    useEffect(() => {
        if (data) {
            form.reset({
                retryDelay: data.retryDelay,
                httpClientRetries: data.httpClientRetries,
                requestTimeoutMs: data.requestTimeoutMs,
                paginationPageSize: data.paginationPageSize,
                retryStatusCodes: data.retryStatusCodes,
            });
        }
    }, [data, form.reset]);
    const update = useUpdateNetwork();
    const submit: SubmitHandler<NetworkSettingsFormType> = async (data) => {
        await update.mutateAsync(
            { ...data },
            {
                onSuccess: (res) => {
                    if (res) {
                        form.reset({ ...res });
                    }
                },
            },
        );
    };

    const loading = form.formState.isSubmitting || update.isPending;

    if (isLoading) return <Spinner />;

    const formId = 'network-form-id';
    return (
        <UiFormContainer className='mt-6'>
            <UiFormInputs
                id={formId}
                form={form}
                submit={submit}
                cols={3}
                contentClassName='w-full'
            >
                <FormTextInput
                    name='retryDelay'
                    type='number'
                    form={form}
                    label={t('retry_delay')}
                />
                <FormTextInput
                    name='httpClientRetries'
                    type='number'
                    form={form}
                    label={t('http_client_retries')}
                />
                <FormTextInput
                    name='requestTimeoutMs'
                    type='number'
                    form={form}
                    label={t('request_timeout_ms')}
                />
                <FormTextInput
                    name='paginationPageSize'
                    type='number'
                    form={form}
                    label={t('pagination_page_size')}
                />
                <FormGroupCheckbox
                    form={form}
                    name='retryStatusCodes'
                    label={t('allowed_headers')}
                    options={statusCode.map((option) => ({
                        value: option,
                        label: option.toString(),
                    }))}
                />
            </UiFormInputs>
            <UiFormFooter form={form}>
                <UiFormSubmit
                    form={formId}
                    className='w-full'
                    loading={loading}
                    disabled={!form.formState.isValid || loading}
                >
                    {t('save')}
                </UiFormSubmit>
            </UiFormFooter>
        </UiFormContainer>
    );
};

export default NetworkForm;
