import {
    type QueryFunction,
    type QueryKey,
    useQuery,
    type UseQueryOptions,
    type UseQueryResult,
} from '@tanstack/react-query';

export type QueryDataResult<TData, TError = Error> = UseQueryResult<TData, TError>;

export type QueryDataProps<
    TQueryData,
    TError = Error,
    TSelectedData = TQueryData,
    TQueryKey extends QueryKey = QueryKey,
> = {
    queryKey: TQueryKey;
    queryFn: QueryFunction<TQueryData, TQueryKey>;
    queryOptions?: Omit<
        UseQueryOptions<TQueryData, TError, TSelectedData, TQueryKey>,
        'queryKey' | 'queryFn'
    >;
};

export const useQueryData = <
    TQueryData,
    TError = Error,
    TSelectedData = TQueryData,
    TQueryKey extends QueryKey = QueryKey,
>({
    queryKey,
    queryFn,
    queryOptions,
}: QueryDataProps<TQueryData, TError, TSelectedData, TQueryKey>): UseQueryResult<
    TSelectedData,
    TError
> =>
    useQuery<TQueryData, TError, TSelectedData, TQueryKey>({
        queryKey,
        queryFn,
        ...queryOptions,
    });
