// src\packages\shared-web\src\api-service\use-api-mutation.ts
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

export type ApiMutationProps<TData, TVariables, TContext = unknown> = Omit<
    OperationType,
    'apiKey' | 'deviceType'
> & {
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
    const apiClient = createApiClient({
        baseUrl: commonConfig.baseUrl,
        socketUrl: commonConfig.socketUrl,
    });

    return useMutationData<TData, TVariables, ApiResponseError, TContext>({
        queryKeys,
        mutationFn: async (variables) => {
            try {
                const { id, ...body } =
                    variables && typeof variables === 'object' && !Array.isArray(variables)
                        ? (variables as Record<string, unknown>)
                        : { id: undefined };

                const response = await apiClient.request<ApiResponseSuccess<TData>>({
                    ...operation,
                    id: typeof id === 'string' ? id : operation.id,
                    method,
                    deviceType: commonConfig.deviceType,
                    apiKey: commonConfig.apiKey,
                    body: method === 'delete' && id ? undefined : body,
                    options: {
                        ...commonConfig.options,
                        ...operation.options,
                    },
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
