import { createApiClient, type OperationType } from '@org/http-client';
import {
    type QueryDataProps,
    type QueryDataResult,
    useQueryData,
} from '@org/query-client';
import type { ApiResponseError, ApiResponseSuccess } from '@org/types';
import type { QueryKey } from '@tanstack/react-query';
import { commonConfig } from './web-base-url';

export type ApiQueryProps<
    TData,
    TSelectedData = TData,
    TQueryKey extends QueryKey = QueryKey,
> = OperationType & {
    queryKey: TQueryKey;
    queryOptions?: QueryDataProps<
        TData,
        ApiResponseError,
        TSelectedData,
        TQueryKey
    >['queryOptions'];
};

export const useApiQuery = <
    TData,
    TSelectedData = TData,
    TQueryKey extends QueryKey = QueryKey,
>({
    queryKey,
    queryOptions,
    ...operation
}: ApiQueryProps<TData, TSelectedData, TQueryKey>): QueryDataResult<
    TSelectedData,
    ApiResponseError
> => {
    const apiClient = createApiClient({ baseUrl: commonConfig.baseUrl });

    return useQueryData<TData, ApiResponseError, TSelectedData, TQueryKey>({
        queryKey,
        queryFn: async () => {
            const response = await apiClient.get<ApiResponseSuccess<TData>>({
                ...operation,
                options: { ...commonConfig.options, ...operation.options },
            });
            return response.data;
        },
        queryOptions,
    });
};
