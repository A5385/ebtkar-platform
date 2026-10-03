import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { EventEnvelope } from '../../helpers/generate-event.js';
import { EVENT_PATTERN } from '@org/constants';
import type { AdminConfigUpdatedEvent } from '@org/types';
import { AdminConfigService } from './admin-config.service.js';

type IncomingConfigEvent = EventEnvelope &
    Partial<AdminConfigUpdatedEvent> & {
        payload?: AdminConfigUpdatedEvent;
    };

@Controller()
export class AdminConfigEventsController {
    private readonly logger = new Logger(AdminConfigEventsController.name);

    constructor(private readonly adminConfig: AdminConfigService) {}

    @EventPattern(EVENT_PATTERN.admin.configUpdated, Transport.KAFKA)
    onConfigUpdated(@Payload() event: IncomingConfigEvent) {
        return this.handle(event);
    }

    @EventPattern(EVENT_PATTERN.admin.configSync, Transport.KAFKA)
    onConfigSync(@Payload() event: IncomingConfigEvent) {
        return this.handle(event);
    }

    private async handle(event: IncomingConfigEvent) {
        const payload = event.payload ?? {
            scope: event.scope,
            version: event.version,
            updatedAt: event.updatedAt,
            reason: event.reason,
        };

        if (payload.version == null) {
            this.logger.warn('Ignored admin config event without version');
            return;
        }

        this.logger.log(`Admin config ${payload.reason ?? 'update'} v${payload.version}`);
        await this.adminConfig.applyEvent(payload as AdminConfigUpdatedEvent);
    }
}
