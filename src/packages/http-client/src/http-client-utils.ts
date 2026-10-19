// src\packages\http-client\src\http-client-utils.ts
import { RequestKeys } from '@org/constants';
import { DEFAULT_NETWORK_SETTINGS } from './get-network-config.js';
import { QueryParamsType } from './http-client.type.js';

export type CreateUrlProps = {
    baseUrl: string;
    endpoint: string;
    id?: string;
    queryParams?: QueryParamsType;
    defaultPageSize?: number;
};

export const createUrl = ({
    baseUrl,
    endpoint,
    id,
    queryParams,
    defaultPageSize = DEFAULT_NETWORK_SETTINGS.paginationPageSize,
}: CreateUrlProps): string => {
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
            value.forEach((item) => search.append(key, String(item)));
        } else {
            search.set(key, String(value));
        }
    });

    // TanStack pageIndex is 0-based; backend page is 1-based.
    if (queryParams?.pagination) {
        const { pageIndex, pageSize } = queryParams.pagination;

        search.set(RequestKeys.page, String(pageIndex + 1));
        search.set(RequestKeys.pageSize, String(pageSize ?? defaultPageSize));
    }

    // sort: origin:asc,createdAt:desc
    if (queryParams?.sort?.length) {
        search.set(
            'sort',
            queryParams.sort.map(({ id, desc }) => `${id}:${desc ? 'desc' : 'asc'}`).join(','),
        );
    }

    const query = search.toString();

    return `${segments.join('/')}${query ? `?${query}` : ''}`;
};
