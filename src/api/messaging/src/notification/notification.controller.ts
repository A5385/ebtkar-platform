import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { EVENT_PATTERN, MESSAGE_PATTERN } from '@org/constants';
import type { UserCreatedEvent } from '@org/types';
import { NotificationService } from './notification.service.js';

@Controller()
export class NotificationController {
    private readonly logger = new Logger(NotificationController.name);

    constructor(private readonly notificationService: NotificationService) {}

    @EventPattern(EVENT_PATTERN.auth.userCreated, Transport.KAFKA)
    async onUserCreated(@Payload() event: UserCreatedEvent) {
        this.logger.log(`Received user-created event ${event.eventId} for user ${event.userId}`);
        try {
            const notification = await this.notificationService.createUserCreatedNotification(event);
            this.logger.log(
                `Completed user-created event ${event.eventId}; notification ${notification.notificationId} is ready for admins`,
            );
            return notification;
        } catch (error: unknown) {
            this.logger.error(
                `Failed user-created event ${event.eventId} for user ${event.userId}`,
                error instanceof Error ? error.stack : String(error),
            );
            throw error;
        }
    }

    @MessagePattern(MESSAGE_PATTERN.messaging.notification.getAdminNotifications, Transport.TCP)
    getAdminNotifications() {
        return this.notificationService.getAdminNotifications();
    }
}
