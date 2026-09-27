// src\packages\shared-web\src\api-service\web-base-url.ts
import { DeviceType } from '@org/http-client';
import { webEnv } from '../web-env';

// console.log('VITE_API_GATEWAY_URL=', import.meta.env.VITE_API_GATEWAY_URL);
// console.log('API_GATEWAY_HOST=', import.meta.env.API_GATEWAY_HOST);

export const baseUrl = webEnv.get('VITE_API_GATEWAY_URL') ?? '';
export const apiKey = webEnv.get('VITE_API_KEY') ?? '';
// console.log('BASE URL=', baseUrl);

export const commonConfig = {
    baseUrl,
    options: { credentials: 'include' as const },
    deviceType: 'web' as DeviceType,
    apiKey,
};
