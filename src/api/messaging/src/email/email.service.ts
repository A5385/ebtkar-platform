import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { apiEnv } from '@org/api-shared';
import nodemailer, { type Transporter } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
    private readonly logger = new Logger(EmailService.name);
    private readonly transporter: Transporter;

    constructor() {
        const host = apiEnv.get('MAIL_HOST');
        const user = apiEnv.get('MAIL_USER');
        const password = apiEnv.get('MAIL_PASSWORD');
        if (!host || !user || !password) {
            throw new Error('MAIL_HOST, MAIL_USER and MAIL_PASSWORD are required');
        }
        this.transporter = nodemailer.createTransport({
            host,
            port: Number(apiEnv.get('MAIL_PORT')) || 587,
            secure: apiEnv.get('MAIL_SECURE') === 'true',
            auth: { user, pass: password },
        });
    }

    async onModuleInit(): Promise<void> {
        await this.transporter.verify();
        this.logger.log('Mail server connection verified');
    }

    async sendOtp(email: string, otp: string): Promise<void> {
        await this.transporter.sendMail({
            from: apiEnv.get('MAIL_FROM') || apiEnv.get('MAIL_USER'),
            to: email,
            subject: 'Verify your email',
            text: `Your verification code is ${otp}`,
            html: `<p>Your verification code is <strong>${otp}</strong>.</p>`,
        });
        this.logger.log(`OTP email delivered to ${email}`);
    }
}
