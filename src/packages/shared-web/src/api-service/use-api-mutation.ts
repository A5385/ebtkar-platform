import { createApiClient, type MethodType, type OperationType } from '@org/http-client';
import {
    type MutationDataProps,
    type MutationDataResult,
    useMutationData,
} from '@org/query-client';
import type { ApiResponseError, ApiResponseSuccess } from '@org/types';
import type { QueryKey } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { showApiError, showApiSuccess } from './api-toast';
import { commonConfig } from './web-base-url';

export type ApiMutationProps<TData, TVariables, TContext = unknown> = OperationType & {
    method: Exclude<MethodType, 'get'>;
    queryKeys?: QueryKey[];
    showSuccessMessage?: boolean;
    showErrorMessage?: boolean;
    mutationOptions?: MutationDataProps<
        TData,
        TVariables,
        ApiResponseError,
        TContext
    >['mutationOptions'];
};

export const useApiMutation = <TData, TVariables = void, TContext = unknown>({
    method,
    queryKeys,
    showSuccessMessage = true,
    showErrorMessage = true,
    mutationOptions,
    ...operation
}: ApiMutationProps<TData, TVariables, TContext>): MutationDataResult<
    TData,
    TVariables,
    ApiResponseError,
    TContext
> => {
    const { t } = useTranslation();
    const apiClient = createApiClient({ baseUrl: commonConfig.baseUrl });

    return useMutationData<TData, TVariables, ApiResponseError, TContext>({
        queryKeys,
        mutationFn: async (variables) => {
            try {
                const response = await apiClient.request<ApiResponseSuccess<TData>>({
                    ...operation,
                    method,
                    body: variables as Record<string, unknown>,
                    options: { ...commonConfig.options, ...operation.options },
                });
                if (showSuccessMessage) showApiSuccess(t, response);
                return response.data;
            } catch (error) {
                if (showErrorMessage) showApiError(t, error);
                throw error;
            }
        },
        mutationOptions,
    });
};
