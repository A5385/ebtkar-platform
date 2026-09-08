import { webEnv } from '../web-env';

export const baseUrl = webEnv.get('API_GATEWAY_URL') ?? '';
export const commonConfig = {
    baseUrl,
    options: { credentials: 'include' as const },
};
