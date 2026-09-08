import {
    type MutationFunction,
    type QueryKey,
    useMutation,
    type UseMutationOptions,
    type UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query';

export type MutationDataResult<
    TData,
    TVariables = void,
    TError = Error,
    TContext = unknown,
> = UseMutationResult<TData, TError, TVariables, TContext>;

export type MutationDataProps<
    TData,
    TVariables = void,
    TError = Error,
    TContext = unknown,
> = {
    mutationFn: MutationFunction<TData, TVariables>;
    queryKeys?: QueryKey[];
    mutationOptions?: Omit<
        UseMutationOptions<TData, TError, TVariables, TContext>,
        'mutationFn'
    >;
};

export const useMutationData = <
    TData,
    TVariables = void,
    TError = Error,
    TContext = unknown,
>({
    mutationFn,
    queryKeys,
    mutationOptions,
}: MutationDataProps<TData, TVariables, TError, TContext>): UseMutationResult<
    TData,
    TError,
    TVariables,
    TContext
> => {
    const queryClient = useQueryClient();
    const { onSuccess, ...options } = mutationOptions ?? {};

    return useMutation<TData, TError, TVariables, TContext>({
        ...options,
        mutationFn,
        onSuccess: async (...args) => {
            await onSuccess?.(...args);
            if (!queryKeys?.length) return;
            await Promise.all(
                queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
            );
        },
    });
};
