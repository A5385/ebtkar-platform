// src\web\admin\src\components\features\origin\origin-form.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { type CreateOriginFormType, createOriginSchema } from '@org/schemas/admin';
import { HttpMethodType, type Origin } from '@org/schemas/admin/schema';
import {
    FormCheckbox,
    FormGroupCheckbox,
    FormTextInput,
    UiFormContainer,
    UiFormFooter,
    UiFormInputs,
    UiFormSubmit,
    useCreateOrigin,
    useSheet,
    useUpdateOrigin,
} from '@org/shared-web';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const methods: HttpMethodType[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
const allowedHeaders: string[] = [
    'Accept',
    'Authorization',
    'Content-Type',
    'X-Requested-With',
    'X-From-Mobile-App',
];

const OriginForm = ({ origin }: { origin?: Origin }) => {
    const { closeSheet } = useSheet();
    const { t } = useTranslation();

    const originId = origin ? origin.originId : undefined;
    const isUpdate = Boolean(origin && originId);
    const form = useForm<CreateOriginFormType>({
        mode: 'onChange',
        resolver: zodResolver(createOriginSchema),
        defaultValues: {
            ...(origin ?? {
                origin: '',
                methods: [],
                allowedHeaders: [],
                credentials: true,
            }),
        },
    });

    const { isValid, errors } = form.formState;

    const invalidFields = Object.keys(errors);

    const onSuccess = () => {
        closeSheet();

        form.reset();
    };
    const create = useCreateOrigin();
    const update = useUpdateOrigin();
    const submit: SubmitHandler<CreateOriginFormType> = async (data) => {
        // alert(JSON.stringify(data, null, 2));
        if (isUpdate && originId) {
            return await update.mutateAsync(
                {
                    originId,
                    ...data,
                },
                {
                    onSuccess,
                },
            );
        } else {
            return await create.mutateAsync(
                {
                    ...data,
                },
                { onSuccess },
            );
        }
    };
    const formId = 'origin-form';
    const loading = form.formState.isSubmitting || create.isPending || update.isPending;
    return (
        <UiFormContainer>
            <UiFormInputs id={formId} form={form} submit={submit}>
                <FormTextInput
                    name='origin'
                    type='text'
                    form={form}
                    placeholder='http://domain.com'
                />
                <FormCheckbox form={form} name='credentials' label={t('credentials')} />
                <FormGroupCheckbox
                    form={form}
                    name='allowedHeaders'
                    label={t('allowed_headers')}
                    options={allowedHeaders.map((option) => ({
                        value: option,
                        label: option,
                    }))}
                />
                <FormGroupCheckbox
                    form={form}
                    name='methods'
                    label={t('methods')}
                    options={methods.map((option) => ({
                        value: option,
                        label: option,
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
                {!isValid && (
                    <div className='text-sm text-muted-foreground'>
                        <p>{t('complete_required_fields')}</p>

                        <ul className='list-disc pl-5'>
                            {invalidFields.map((field) => (
                                <li key={field}>{t(field)}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </UiFormFooter>
        </UiFormContainer>
    );
};

export default OriginForm;
