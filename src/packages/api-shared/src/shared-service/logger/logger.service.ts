import { Inject, Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

import { APP_NAME } from '../shared-api.constants.js';

@Injectable()
export class WinstonLoggerService implements LoggerService {
    private readonly logger: winston.Logger;

    constructor(
        @Inject(APP_NAME)
        private readonly appName: string,
    ) {
        this.logger = winston.createLogger({
            level: 'info',

            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message, context }) => {
                    return (
                        `${this.appName.toUpperCase()} | ` +
                        `${level} | ${timestamp} | ` +
                        `${context ?? 'Application'} | ${message}`
                    );
                }),
            ),

            transports: [new winston.transports.Console()],
        });
    }

    log(message: unknown, context?: string): void {
        this.logger.info(String(message), { context });
    }

    error(message: unknown, trace?: string, context?: string): void {
        this.logger.error(String(message), {
            trace,
            context,
        });
    }

    warn(message: unknown, context?: string): void {
        this.logger.warn(String(message), { context });
    }

    debug(message: unknown, context?: string): void {
        this.logger.debug(String(message), { context });
    }

    verbose(message: unknown, context?: string): void {
        this.logger.verbose(String(message), { context });
    }
}
