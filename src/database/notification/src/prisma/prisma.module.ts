import { Global, Module } from '@nestjs/common';
import { NotificationPrismaService } from './prisma.service.js';

@Global()
@Module({ providers: [NotificationPrismaService], exports: [NotificationPrismaService] })
export class NotificationPrismaModule {}
