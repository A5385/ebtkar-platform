import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { EVENT_PATTERN } from '@org/constants';
import type { OtpEmailRequestedEvent } from '@org/types';
import { EmailService } from './email.service.js';

@Controller()
export class EmailController {
    private readonly logger = new Logger(EmailController.name);

    constructor(private readonly emailService: EmailService) {}

    @EventPattern(EVENT_PATTERN.auth.otpEmailRequested, Transport.KAFKA)
    async sendOtp(@Payload() event: OtpEmailRequestedEvent): Promise<void> {
        this.logger.log(`Received OTP email event ${event.eventId} for user ${event.userId}`);
        try {
            await this.emailService.sendOtp(event.email, event.otp);
            this.logger.log(`Completed OTP email event ${event.eventId}`);
        } catch (error: unknown) {
            this.logger.error(
                `Failed OTP email event ${event.eventId} for user ${event.userId}`,
                error instanceof Error ? error.stack : String(error),
            );
            throw error;
        }
    }
}
