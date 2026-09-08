export {
    QueryClient,
    QueryClientProvider,
    type QueryClientConfig,
} from '@tanstack/react-query';

import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';

export const defaultQueryClientConfig = {
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30_000,
        },
    },
} satisfies QueryClientConfig;

export const createQueryClient = (config: QueryClientConfig = {}) =>
    new QueryClient({
        ...defaultQueryClientConfig,
        ...config,
        defaultOptions: {
            ...defaultQueryClientConfig.defaultOptions,
            ...config.defaultOptions,
            queries: {
                ...defaultQueryClientConfig.defaultOptions.queries,
                ...config.defaultOptions?.queries,
            },
        },
    });
