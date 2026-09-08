// packages/http-client/src/http-client.ts

import { EndpointType } from '@org/types';

export type MethodType = 'get' | 'post' | 'patch' | 'delete';

export type CreateApiClientProps = {
    baseUrl: string;
};

export type ApiRequestProps = {
    endpoint: EndpointType;
    method?: MethodType;
    body?: RequestInit['body'] | Record<string, unknown>;
    headers?: RequestInit['headers'];
    options?: Omit<RequestInit, 'method' | 'body' | 'headers'>;
};

export type OperationType = {
    endpoint: EndpointType;
    options?: ApiRequestProps['options'];
};

export type OperationTypeWithBody = OperationType & {
    body?: ApiRequestProps['body'];
};
export const createApiClient = ({ baseUrl }: CreateApiClientProps) => {
    const apiRequest = async <T>({
        endpoint,
        method = 'get',
        body,
        headers,
        options,
    }: ApiRequestProps): Promise<T> => {
        const isFormData = body instanceof FormData;

        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method,
            body: isFormData ? body : body ? JSON.stringify(body) : undefined,
            headers: {
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                ...headers,
            },
            ...options,
        });

        const contentType = response.headers.get('content-type');
        const result = contentType?.includes('application/json') ? await response.json() : undefined;

        if (!response.ok) {
            throw result ?? new Error(`Request failed with status ${response.status}`);
        }

        return result as T;
    };

    return {
        request: apiRequest,
        get: <T>(props: OperationType) => apiRequest<T>({ method: 'get', ...props }),
        post: <T>(props: OperationTypeWithBody) => apiRequest<T>({ method: 'post', ...props }),
        patch: <T>(props: OperationTypeWithBody) => apiRequest<T>({ method: 'patch', ...props }),
        delete: <T>(props: OperationType) => apiRequest<T>({ method: 'delete', ...props }),
    };
};

export type ApiClient = ReturnType<typeof createApiClient>;
