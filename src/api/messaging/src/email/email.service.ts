import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { apiEnv } from '@org/api-shared';
import nodemailer, { type Transporter } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
    private readonly logger = new Logger(EmailService.name);
    private readonly transporter: Transporter;
    private readonly adminEmail: string;

    constructor() {
        const host = apiEnv.get('MAIL_HOST');
        const user = apiEnv.get('MAIL_USER');
        const password = apiEnv.get('MAIL_PASSWORD');

        if (!host || !user || !password) {
            throw new Error('MAIL_HOST, MAIL_USER and MAIL_PASSWORD are required');
        }

        this.adminEmail = apiEnv.get('ADMIN_EMAIL') || 'ahmed.5aled1985@gmail.com';

        this.transporter = nodemailer.createTransport({
            host,
            port: Number(apiEnv.get('MAIL_PORT')) || 587,
            secure: apiEnv.get('MAIL_SECURE') === 'true',
            auth: {
                user,
                pass: password,
            },
        });
    }

    async onModuleInit(): Promise<void> {
        await this.transporter.verify();

        this.logger.log('Mail server connection verified');
    }

    async sendOtp(email: string, otp: string): Promise<void> {
        await this.sendOtpEmail({
            to: email,
            otp,
            subject: 'Verify your email',
            title: 'Verify Your Email',
            message: 'Use the verification code below to verify your email address.',
            text: `Your verification code is ${otp}. Do not share this code with anyone.`,
        });
    }

    async forgetPasswordOtpSend(email: string, otp: string): Promise<void> {
        await this.sendOtpEmail({
            to: email,
            otp,
            subject: 'Reset your password',
            title: 'Reset Your Password',
            message: 'Use the verification code below to continue resetting your password.',
            text: `Your password reset verification code is ${otp}. Do not share this code with anyone.`,
        });
    }

    async verifyHardDeleteOtp(email: string, otp: string): Promise<void> {
        await this.sendOtpEmail({
            to: this.adminEmail,
            otp,
            subject: 'Confirm Permanent User Deletion',
            title: 'Confirm User Deletion',
            message: `
        You are about to permanently delete the user
        <strong>${email}</strong>.
        <br /><br />
        Please verify the request carefully before continuing.
      `,
            text: `You are attempting to permanently delete the user with email ${email}. Confirmation code: ${otp}`,
        });
    }

    private async sendOtpEmail({
        to,
        otp,
        subject,
        title,
        message,
        text,
    }: {
        to: string;
        otp: string;
        subject: string;
        title: string;
        message: string;
        text: string;
    }): Promise<void> {
        await this.transporter.sendMail({
            from: apiEnv.get('MAIL_FROM') || apiEnv.get('MAIL_USER'),
            to,
            subject,
            text,
            html: this.html({
                otp,
                title,
                message,
            }),
        });

        this.logger.log(`OTP email delivered to ${to}`);
    }

    private html({
        otp,
        title = 'Verification Code',
        message = 'Use the verification code below to continue.',
    }: {
        otp: string;
        title?: string;
        message?: string;
    }): string {
        return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>${title}</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              width: 100%;
              background-color: #f4f4f4;
            "
          >
            <tr>
              <td
                align="center"
                style="padding: 30px 15px;"
              >
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    width: 100%;
                    max-width: 480px;
                    background-color: #ffffff;
                    border-radius: 8px;
                  "
                >
                  <tr>
                    <td
                      align="center"
                      style="padding: 40px 30px;"
                    >
                      <h1
                        style="
                          margin: 0 0 20px;
                          font-size: 26px;
                          line-height: 34px;
                          font-weight: 600;
                          color: #2563eb;
                        "
                      >
                        ${title}
                      </h1>

                      <div
                        style="
                          margin: 0 0 24px;
                          font-size: 16px;
                          line-height: 24px;
                          color: #444444;
                        "
                      >
                        ${message}
                      </div>

                      <table
                        role="presentation"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                      >
                        <tr>
                          <td
                            align="center"
                            style="
                              background-color: #2563eb;
                              border-radius: 6px;
                              padding: 12px 24px;
                            "
                          >
                            <span
                              style="
                                color: #ffffff;
                                font-size: 28px;
                                line-height: 36px;
                                font-weight: bold;
                                letter-spacing: 6px;
                              "
                            >
                              ${otp}
                            </span>
                          </td>
                        </tr>
                      </table>

                      <p
                        style="
                          margin: 24px 0 0;
                          font-size: 13px;
                          line-height: 20px;
                          color: #777777;
                        "
                      >
                        If you did not request this code,
                        you can safely ignore this email.
                      </p>

                      <p
                        style="
                          margin: 8px 0 0;
                          font-size: 13px;
                          line-height: 20px;
                          color: #777777;
                        "
                      >
                        Do not share this verification code with anyone.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
    }
}
