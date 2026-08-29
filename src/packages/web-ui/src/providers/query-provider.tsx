import { createQueryClient, QueryClientProvider, type QueryClient } from '@org/query-client';
import { type ReactNode, useState } from 'react';

export interface QueryProviderProps {
    children: ReactNode;
    client?: QueryClient;
}

export function QueryProvider({ children, client }: QueryProviderProps) {
    const [queryClient] = useState(() => client ?? createQueryClient());

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
