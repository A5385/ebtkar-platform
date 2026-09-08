import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EVENT_PATTERN } from '@org/constants';
import { NotificationPrismaService } from '@org/database-notification';
import type { NotificationCreatedEvent, UserCreatedEvent } from '@org/types';
import { randomUUID } from 'node:crypto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly prisma: NotificationPrismaService,
        @Inject('MESSAGING_EVENTS') private readonly events: ClientKafka,
    ) {}

    async createUserCreatedNotification(event: UserCreatedEvent) {
        const notification = await this.prisma.notification.upsert({
            where: { eventId: event.eventId },
            update: {},
            create: {
                eventId: event.eventId,
                audience: 'ADMIN',
                type: 'USER_CREATED',
                title: 'New user created',
                message: `A new ${event.role.toLowerCase()} user was created`,
                metadata: { userId: event.userId, email: event.email, role: event.role },
            },
        });
        this.logger.log(
            `Saved admin notification ${notification.notificationId} for user-created event ${event.eventId}`,
        );
        const outgoing: NotificationCreatedEvent = {
            eventId: randomUUID(),
            occurredAt: new Date().toISOString(),
            notification,
        };
        await lastValueFrom(
            this.events.emit(EVENT_PATTERN.messaging.notificationCreated, outgoing),
        );
        this.logger.log(`Kafka acknowledged notification-created event ${outgoing.eventId}`);
        return notification;
    }

    getAdminNotifications() {
        return this.prisma.notification.findMany({
            where: { audience: 'ADMIN' },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
}
