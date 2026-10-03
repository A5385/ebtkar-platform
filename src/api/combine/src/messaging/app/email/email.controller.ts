import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { EventEnvelope } from '@org/api-shared';
import { EVENT_PATTERN } from '@org/constants';
import type { OtpEmailRequestedEvent } from '@org/types';
import { EmailService } from './email.service.js';

@Controller()
export class EmailController {
    private readonly logger = new Logger(EmailController.name);

    constructor(private readonly emailService: EmailService) {}

    @EventPattern(EVENT_PATTERN.auth.otpEmailRequested, Transport.KAFKA)
    async sendOtp(
        @Payload()
        event: EventEnvelope & {
            payload: { userId: string; email: string; otp: string };
        } & OtpEmailRequestedEvent,
    ): Promise<void> {
        this.logger.log(
            `Received OTP email event ${event.eventId} for user ${event.payload.userId}`,
        );
        try {
            await this.emailService.sendOtp(event.payload.email, event.payload.otp);
            this.logger.log(`Completed OTP email event ${event.eventId}`);
        } catch (error: unknown) {
            this.logger.error(
                `Failed OTP email event ${event.eventId} for user ${event.payload.userId}`,
                error instanceof Error ? error.stack : String(error),
            );
            throw error;
        }
    }
    @EventPattern(EVENT_PATTERN.auth.otpVerifyUserHardDelete, Transport.KAFKA)
    async verifyHardDeleteOtp(
        @Payload()
        event: EventEnvelope & {
            payload: { userId: string; email: string; otp: string };
        } & OtpEmailRequestedEvent,
    ): Promise<void> {
        this.logger.log(
            `Received OTP email event ${event.eventId} for user ${event.payload.userId}`,
        );
        try {
            await this.emailService.verifyHardDeleteOtp(event.payload.email, event.payload.otp);
            this.logger.log(`Completed hard delete OTP email event ${event.eventId}`);
        } catch (error: unknown) {
            this.logger.error(
                `Failed OTP email event ${event.eventId} for user ${event.payload.userId}`,
                error instanceof Error ? error.stack : String(error),
            );
            throw error;
        }
    }
    @EventPattern(EVENT_PATTERN.auth.forgetPasswordOtp, Transport.KAFKA)
    async forgetPasswordOtpSend(
        @Payload()
        event: EventEnvelope & {
            payload: { userId: string; email: string; otp: string };
        } & OtpEmailRequestedEvent,
    ): Promise<void> {
        console.log('🚀 >  EmailController >  forgetPasswordOtpSend >  event:', event);

        this.logger.log(
            `Received OTP email event ${event.eventId} for user ${event.payload.userId}`,
        );
        try {
            await this.emailService.forgetPasswordOtpSend(event.payload.email, event.payload.otp);
            this.logger.log(`Completed forget password OTP email event ${event.eventId}`);
        } catch (error: unknown) {
            this.logger.error(
                `Failed OTP email event ${event.eventId} for user ${event.payload.userId}`,
                error instanceof Error ? error.stack : String(error),
            );
            throw error;
        }
    }
}
