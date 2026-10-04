//src\packages\shared-web\src\api-service\use-api-query.ts
import { createApiClient, type OperationType } from '@org/http-client';
import { type QueryDataProps, type QueryDataResult, useQueryData } from '@org/query-client';
import type { ApiResponseError, ApiResponseSuccess } from '@org/types';
import type { QueryKey } from '@tanstack/react-query';
import { commonConfig } from './web-base-url';

export type ApiQueryProps<
    TData,
    TSelectedData = TData,
    TQueryKey extends QueryKey = QueryKey,
> = Omit<OperationType, 'deviceType' | 'apiKey'> & {
    queryKey: TQueryKey;
    queryOptions?: QueryDataProps<
        TData,
        ApiResponseError,
        TSelectedData,
        TQueryKey
    >['queryOptions'];
};

export const useApiQuery = <TData, TSelectedData = TData, TQueryKey extends QueryKey = QueryKey>({
    queryKey,
    queryOptions,
    ...operation
}: ApiQueryProps<TData, TSelectedData, TQueryKey>): QueryDataResult<
    TSelectedData,
    ApiResponseError
> => {
    console.log('B queryFn', operation);
    const apiClient = createApiClient({ baseUrl: commonConfig.baseUrl });

    // id and queryParams are part of the request, so they must be part of the cache key
    const fullQueryKey = [
        ...queryKey,
        { id: operation.id, queryParams: operation.queryParams },
    ] as unknown as TQueryKey;

    return useQueryData<TData, ApiResponseError, TSelectedData, TQueryKey>({
        queryKey: fullQueryKey,
        queryFn: async () => {
            const response = await apiClient.get<ApiResponseSuccess<TData>>({
                ...operation,
                deviceType: commonConfig.deviceType,
                apiKey: commonConfig.apiKey,
                options: { ...commonConfig.options, ...operation.options },
            });
            return response.data;
        },
        queryOptions,
    });
};
