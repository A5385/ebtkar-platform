import { EndpointType } from '@org/types';

export type HeaderType = 'json' | 'file';
export type MethodType = 'get' | 'post' | 'patch' | 'delete';
export type CreateApiClientProps = {
    baseUrl: string;
    headerType: HeaderType;
};

export type ApiRequestProps = {
    endpoint: EndpointType;
    method?: MethodType | undefined;
    options?: Omit<RequestInit, 'method' | 'headers'>;
};

export const CreateApiClient = ({ baseUrl, headerType, ...props }: CreateApiClientProps) => {
    const apiRequest = ({ method = 'get', endpoint }: ApiRequestProps) => {
        const url = `${baseUrl}/${endpoint}`;
        const isFile = headerType === 'file';
        return fetch(url, {
            method,
            headers: {
                'Content-Type': isFile ? 'multipart/form-data' : 'application/json',
            },
            ...props,
        });
    };
    return {
        get: (endpoint: EndpointType) => apiRequest({ endpoint, method: 'get' }),
        post: (endpoint: EndpointType) => apiRequest({ endpoint, method: 'post' }),
        patch: (endpoint: EndpointType) => apiRequest({ endpoint, method: 'patch' }),
        delete: (endpoint: EndpointType) => apiRequest({ endpoint, method: 'delete' }),
    };
};
