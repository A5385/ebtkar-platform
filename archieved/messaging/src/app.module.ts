import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { apiEnv, SharedApiModule } from '@org/api-shared';
import { NotificationPrismaModule } from '@org/database-notification';
import { EmailController } from './email/email.controller.js';
import { EmailService } from './email/email.service.js';
import { NotificationController } from './notification/notification.controller.js';
import { NotificationService } from './notification/notification.service.js';

const brokers = [
    `${apiEnv.get('KAFKA_HOST') || '127.0.0.1'}:${apiEnv.get('KAFKA_PORT') || '9092'}`,
];

@Module({
    imports: [
        NotificationPrismaModule,
        SharedApiModule.forRoot({ appName: 'MESSAGING API' }),
        ClientsModule.register([
            {
                name: 'MESSAGING_EVENTS',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'api-messaging-producer',
                        brokers,
                    },
                    producerOnlyMode: true,
                },
            },
        ]),
    ],
    controllers: [EmailController, NotificationController],
    providers: [EmailService, NotificationService],
})
export class AppModule {}
