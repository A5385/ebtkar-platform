// src/packages/http-client/src/http-client.ts

import { RequestKeys } from '@org/constants';
import { EndpointType } from '@org/types';

export type FiltersType = {
    id: string;
    value: unknown;
};

export type PaginationType = {
    pageSize: number;
    pageIndex: number;
};

export type SortType = {
    desc: boolean;
    id: string;
};

export type QueryParamsType = {
    filters?: FiltersType[];
    pagination?: PaginationType; // single object, not an array
    sort?: SortType[];
};

export type MethodType = 'get' | 'post' | 'patch' | 'delete';

export type CreateApiClientProps = {
    baseUrl: string;
};

export type DeviceType = 'mobile' | 'web';

export type ApiRequestProps = {
    endpoint: EndpointType;
    id?: string;
    queryParams?: QueryParamsType;
    method?: MethodType;
    body?: RequestInit['body'] | Record<string, unknown>;
    headers?: RequestInit['headers'];
    options?: Omit<RequestInit, 'method' | 'body' | 'headers'>;
    apiKey: string;
    deviceType: DeviceType;
};

export type OperationType = {
    endpoint: EndpointType;
    id?: string;
    queryParams?: QueryParamsType;
    options?: ApiRequestProps['options'];
    apiKey: string;
    deviceType: DeviceType;
};

export type OperationTypeWithBody = OperationType & {
    body?: ApiRequestProps['body'];
};

type CreateUrlProps = {
    baseUrl: string;
    endpoint: string;
    id?: string;
    queryParams?: QueryParamsType;
};

export const createUrl = ({ baseUrl, endpoint, id, queryParams }: CreateUrlProps): string => {
    const segments = [
        baseUrl.replace(/\/+$/, ''),
        endpoint.replace(/^\/+|\/+$/g, ''),
        ...(id ? [encodeURIComponent(id)] : []),
    ];

    const search = new URLSearchParams();

    // filters: { id: 'origin', value: '6000' } -> origin=6000
    queryParams?.filters?.forEach(({ id: key, value }) => {
        if (value === undefined || value === null || value === '') return;
        if (Array.isArray(value)) {
            value.forEach((v) => search.append(key, String(v)));
        } else {
            search.set(key, String(value));
        }
    });

    // TanStack pageIndex is 0-based, the backend page is 1-based
    if (queryParams?.pagination) {
        search.set(RequestKeys.page, String(queryParams.pagination.pageIndex + 1));
        search.set(RequestKeys.pageSize, String(queryParams.pagination.pageSize));
    }

    // sort: origin:asc,createdAt:desc
    if (queryParams?.sort?.length) {
        search.set(
            'sort',
            queryParams.sort.map((s) => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(','),
        );
    }

    const query = search.toString();
    return `${segments.join('/')}${query ? `?${query}` : ''}`;
};

export const createApiClient = ({ baseUrl }: CreateApiClientProps) => {
    const apiRequest = async <T>({
        endpoint,
        id,
        queryParams,
        method = 'get',
        body,
        headers,
        options,
        deviceType,
        apiKey,
    }: ApiRequestProps): Promise<T> => {
        console.log('C apiRequest', queryParams);
        const isFormData = body instanceof FormData;

        const response = await fetch(createUrl({ baseUrl, endpoint, id, queryParams }), {
            method,
            body: isFormData ? body : body ? JSON.stringify(body) : undefined,
            headers: {
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                ...headers,
                ...(deviceType ? { [RequestKeys.deviceKey]: deviceType } : undefined),
                ...(apiKey ? { [RequestKeys.apiKey]: apiKey } : undefined),
            },
            ...options,
        });

        const contentType = response.headers.get('content-type');
        const result = contentType?.includes('application/json')
            ? await response.json()
            : undefined;

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
