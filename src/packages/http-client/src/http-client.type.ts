// src\packages\http-client\src\http-client.type.ts
import { NetworkSettingsModel } from '@org/database-admin';
import { EndpointType } from '@org/types';
import { FetchOptions } from 'ofetch';

/**
 * HTTP Client general types
 */
export type FiltersType = {
    id: string;
    value: unknown;
};

export type PaginationType = {
    pageSize?: number;
    pageIndex: number;
};

export type SortType = {
    desc: boolean;
    id: string;
};

export type QueryParamsType = {
    filters?: FiltersType[];
    pagination?: PaginationType;
    sort?: SortType[];
};

export type MethodType = 'get' | 'post' | 'patch' | 'delete';

export type DeviceType = 'mobile' | 'web';

/**
 * Network Settings Props Type
 */
export type NetworkSettingsType = Omit<NetworkSettingsModel, 'createdAt' | 'updatedAt' | 'id'>;
/**
 *
 * Http client instance
 */
export type CreateApiClientProps = {
    baseUrl: string;
    socketUrl: string;
};

export type ApiRequestProps = {
    endpoint: EndpointType;
    id?: string;
    queryParams?: QueryParamsType;
    method?: MethodType;
    body?: FetchOptions['body'] | Record<string, unknown>;
    headers?: FetchOptions['headers'];
    options?: Omit<FetchOptions<'json'>, 'method' | 'body' | 'headers' | 'retry' | 'timeout'>;
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
