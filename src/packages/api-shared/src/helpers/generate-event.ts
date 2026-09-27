import { ClientKafka } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';
import { lastValueFrom } from 'rxjs';

import { WinstonLoggerService } from '../shared-service/index.js';

export interface EventEnvelope {
    eventId: string;
    occurredAt: string;
}

type PublishEventOptions<T extends object> = {
    payload: T;
    client: ClientKafka;
    pattern: string;
    logger: WinstonLoggerService;
    moduleName: string;
    successMessage?: string;
    errorMessage?: string;
};

export const publishEvent = async <T extends object>({
    payload,
    client,
    pattern,
    logger,
    moduleName,
    successMessage,
    errorMessage,
}: PublishEventOptions<T>): Promise<boolean> => {
    try {
        const event: EventEnvelope & { payload: T } = {
            eventId: randomUUID(),
            occurredAt: new Date().toISOString(),
            payload,
        };

        await lastValueFrom(client.emit(pattern, event));

        const msg = successMessage ?? `Event Successfully Published: "${pattern}"`;

        logger.log(msg, moduleName);

        return true;
    } catch (error) {
        const msg = errorMessage ?? `Failed to Publish Event "${pattern}"`;

        logger.error(
            `${msg}: ${error instanceof Error ? error.message : String(error)}`,
            moduleName,
        );

        return false;
    }
};
