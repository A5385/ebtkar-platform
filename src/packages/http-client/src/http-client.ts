// src\packages\http-client\src\http-client.ts
import { RequestKeys } from '@org/constants';
import { connectNetworkSettingsSocket } from '@org/infra/socket';
import type { FetchOptions } from 'ofetch';
import { ofetch } from 'ofetch';
import { networkConfig } from './get-network-config.js';
import { createUrl } from './http-client-utils.js';
import {
    ApiRequestProps,
    CreateApiClientProps,
    OperationType,
    OperationTypeWithBody,
} from './http-client.type.js';

const socketConnections = new Map<
    string,
    {
        baseUrls: Set<string>;
        disconnect: () => void;
    }
>();
const registerNetworkSettingsSocket = (socketUrl: string, baseUrl: string) => {
    const key = socketUrl.replace(/\/+$/, '');
    const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');

    const existing = socketConnections.get(key);

    if (existing) {
        existing.baseUrls.add(normalizedBaseUrl);
        return;
    }

    const baseUrls = new Set([normalizedBaseUrl]);

    const disconnect = connectNetworkSettingsSocket({
        url: key,
        listener: () => {
            console.log('[Network Socket] Event received');
            for (const url of baseUrls) {
                void networkConfig(url, true);
            }
        },
    });

    socketConnections.set(key, { baseUrls, disconnect });
};
export const createApiClient = ({ baseUrl, socketUrl }: CreateApiClientProps) => {
    registerNetworkSettingsSocket(socketUrl, baseUrl);
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
        const { paginationPageSize: defaultPageSize, ...fetchProps } = await networkConfig(baseUrl);
        console.log('🚀 >  apiRequest >  defaultPageSize:', defaultPageSize);

        console.log('🚀 >  apiRequest >  fetchProps:', fetchProps);

        const url = createUrl({
            baseUrl,
            endpoint,
            id,
            queryParams,
            defaultPageSize,
        });

        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

        const config: FetchOptions<'json', T> = {
            ...options,
            ...fetchProps,

            method,
            body: body as FetchOptions<'json'>['body'],

            headers: {
                ...(!isFormData && body !== undefined
                    ? {
                          'Content-Type': 'application/json',
                      }
                    : {}),

                ...headers,

                ...(deviceType
                    ? {
                          [RequestKeys.deviceKey]: deviceType,
                      }
                    : {}),

                ...(apiKey
                    ? {
                          [RequestKeys.apiKey]: apiKey,
                      }
                    : {}),
            },
        };

        return ofetch<T>(url, config);
    };

    return {
        request: apiRequest,

        get: <T>(props: OperationType) =>
            apiRequest<T>({
                method: 'get',
                ...props,
            }),

        post: <T>(props: OperationTypeWithBody) =>
            apiRequest<T>({
                method: 'post',
                ...props,
            }),

        patch: <T>(props: OperationTypeWithBody) =>
            apiRequest<T>({
                method: 'patch',
                ...props,
            }),

        delete: <T>(props: OperationType) =>
            apiRequest<T>({
                method: 'delete',
                ...props,
            }),
    };
};

export type ApiClient = ReturnType<typeof createApiClient>;
