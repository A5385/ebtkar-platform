import type { ApiResponseError, ApiResponseSuccess } from '@org/types';
import type { useTranslation } from 'react-i18next';
import { toast } from '../components/ui/toast';

const fallbackErrorMessage = 'unknown_error_occurred_while_processing_your_request';
type TranslationFunction = ReturnType<typeof useTranslation>['t'];
type ApiMessageType = 'success' | 'error';

const translateMessage = (
    t: TranslationFunction,
    type: ApiMessageType,
    message: string,
): string =>
    t(`api_message.${type}.${message}`, {
        defaultValue: t(message, { defaultValue: message }),
    });

export const getApiErrorMessage = (
    t: TranslationFunction,
    error: ApiResponseError | unknown,
): string => {
    if (typeof error === 'object' && error !== null && 'errors' in error) {
        const message = (error as ApiResponseError).errors?.message;
        if (Array.isArray(message)) {
            return message.map((item) => translateMessage(t, 'error', item)).join('\n');
        }
        if (message) return translateMessage(t, 'error', message);
    }

    if (error instanceof Error && error.message) {
        return translateMessage(t, 'error', error.message);
    }
    return translateMessage(t, 'error', fallbackErrorMessage);
};

export const showApiSuccess = <TData>(
    t: TranslationFunction,
    response: ApiResponseSuccess<TData>,
) => {
    if (!response.message) return;
    toast.add({ title: translateMessage(t, 'success', response.message), type: 'success' });
};

export const showApiError = (t: TranslationFunction, error: ApiResponseError | unknown) => {
    toast.add({ title: getApiErrorMessage(t, error), type: 'error' });
};
