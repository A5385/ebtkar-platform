// src\packages\http-client\src\get-network-config.ts
import { ofetch } from 'ofetch';
import { NetworkSettingsType } from './http-client.type.js';

export const DEFAULT_NETWORK_SETTINGS: NetworkSettingsType = {
    httpClientRetries: 3,
    requestTimeoutMs: 30_000,
    paginationPageSize: 10,
    retryDelay: 2 * 1000,
    /**
         *  408 - Request Timeout
            409 - Conflict
            425 - Too Early (Experimental)
            429 - Too Many Requests
            500 - Internal Server Error
            502 - Bad Gateway
            503 - Service Unavailable
            504 - Gateway Timeout
        */
    retryStatusCodes: [408, 409, 425, 429, 500, 502, 503, 504],
};

const NETWORK_CONFIG_TTL = 5 * 60 * 1000;

type NetworkConfigCacheEntry = {
    settings: NetworkSettingsType;
    expiresAt: number;
};

const cache = new Map<string, NetworkConfigCacheEntry>();

export const networkConfig = async (
    baseUrl: string,
    forceRefresh = false,
): Promise<NetworkSettingsType> => {
    const key = baseUrl.replace(/\/+$/, '');
    const cached = cache.get(key);

    if (!forceRefresh && cached && Date.now() < cached.expiresAt) {
        return cached.settings;
    }

    const url = `${key}/admin-network/get-network`;

    try {
        const response = await ofetch<NetworkSettingsType | { data: NetworkSettingsType }>(url, {
            method: 'GET',
            retry: 0,
            timeout: 5_000,
        });

        const settings = 'data' in response ? response.data : response;

        const resolvedSettings = settings ?? DEFAULT_NETWORK_SETTINGS;

        cache.set(key, {
            settings: resolvedSettings,
            expiresAt: Date.now() + NETWORK_CONFIG_TTL,
        });

        return resolvedSettings;
    } catch {
        return cached?.settings ?? DEFAULT_NETWORK_SETTINGS;
    }
};

export const invalidateNetworkConfig = (baseUrl?: string): void => {
    if (baseUrl) {
        cache.delete(baseUrl.replace(/\/+$/, ''));
        return;
    }

    cache.clear();
};
