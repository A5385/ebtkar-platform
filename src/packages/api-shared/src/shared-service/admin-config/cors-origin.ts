import type { AdminAccessSettings } from './admin-config.interface.js';
import type { AdminConfigService } from './admin-config.service.js';

type OriginCallback = (error: Error | null, allow?: boolean) => void;

export function resolveCorsOrigins(
    access: AdminAccessSettings | null | undefined,
    fallbackOrigins: string[],
): string[] {
    if (access?.origins?.length) {
        return access.origins.filter((item) => item.credentials).map((item) => item.origin);
    }

    return fallbackOrigins;
}

export function createCorsOriginDelegate(
    adminConfig: Pick<AdminConfigService, 'tryGet'>,
    fallbackOrigins: string[],
) {
    return (origin: string | undefined, callback: OriginCallback) => {
        if (!origin) {
            callback(null, true);
            return;
        }

        const access = adminConfig.tryGet()?.access;

        if (access && access.corsEnabled === false) {
            callback(null, false);
            return;
        }

        const allowed = resolveCorsOrigins(access, fallbackOrigins);

        if (allowed.length === 0 || allowed.includes('*') || allowed.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(null, false);
    };
}
