import type { CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface.js';
import { AdminConfigService } from '@org/api-shared';
import { RequestKeys } from '@org/constants';
import type { Request } from 'express';

export const createCorsOptionsDelegate =
    (adminService: AdminConfigService): CorsOptionsDelegate<Request> =>
    (req, callback) => {
        const origin = req.headers.origin;
        const origins = adminService.tryGet()?.access?.origins;
        const config = origins?.find((item) => item.origin === origin && item.credentials);

        if (!origin || !config) {
            return callback(null, { origin: false });
        }

        return callback(null, {
            origin,
            credentials: config.credentials ?? true,
            methods: config.methods,
            allowedHeaders: [
                ...(config.allowedHeaders ?? []),
                RequestKeys.apiKey,
                RequestKeys.deviceKey,
            ],
        });
    };
