import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { EVENT_PATTERN } from '@org/constants';
import type { NotificationCreatedEvent } from '@org/types';
import { NotificationGateway } from './notification.gateway.js';

@Controller()
export class NotificationEventsController {
    constructor(private readonly gateway: NotificationGateway) {}

    @EventPattern(EVENT_PATTERN.messaging.notificationCreated, Transport.KAFKA)
    onNotificationCreated(@Payload() event: NotificationCreatedEvent): void {
        this.gateway.publish(event.notification);
    }
}
