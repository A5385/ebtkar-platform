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

export function createQueryClient(config: QueryClientConfig = {}): QueryClient {
    return new QueryClient({
        ...defaultQueryClientConfig,
        ...config,
        defaultOptions: {
            ...defaultQueryClientConfig.defaultOptions,
            ...config.defaultOptions,
            queries: {
                ...defaultQueryClientConfig.defaultOptions?.queries,
                ...config.defaultOptions?.queries,
            },
        },
    });
}

export { QueryClient, QueryClientProvider } from '@tanstack/react-query';
export type { QueryClientConfig } from '@tanstack/react-query';
