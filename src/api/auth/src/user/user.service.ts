import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDto, UpdateUserDto, VerifyEmailDto } from '@org/api-dto';
import {
    convertToEndDate,
    convertToStartDate,
    ErrorService,
    extractRequestQueries,
    ResponseHelperService,
    WinstonLoggerService,
} from '@org/api-shared';
import { EVENT_PATTERN } from '@org/constants';
import { AuthPrismaService } from '@org/database-auth';
import { Role } from '@org/database-auth/prisma';
import { User } from '@org/schemas/auth';
import type { OtpEmailRequestedEvent, UserCreatedEvent } from '@org/types';
import { randomInt, randomUUID } from 'node:crypto';
import { lastValueFrom } from 'rxjs';
import { MICROSERVICE_CLIENT } from '../microservice';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: AuthPrismaService,
        private readonly apiHandler: ResponseHelperService,
        private readonly logger: WinstonLoggerService,
        private readonly error: ErrorService,
        @Inject(MICROSERVICE_CLIENT.authEvents.name) private readonly events: ClientKafka,
    ) {}

    private moduleName = 'User';

    async checkEmailExist(email: string) {
        return await this.apiHandler.handle({
            method: 'check',
            successMessage: 'email_availability_checked',
            logger: this.logger,
            fn: async () => {
                const user = await this.findUserByUnique({ email });
                if (user?.success && user.data) {
                    return { available: false };
                } else {
                    return { available: true };
                }
            },
        });
    }

    async createUser({ email, role }: CreateUserDto) {
        return await this.apiHandler.handle({
            method: 'create',
            successMessage: 'user_created',
            logger: this.logger,
            fn: async () => {
                const otp = randomInt(100_000, 1_000_000);
                const user = await this.prisma.user.create({
                    data: {
                        email,
                        role: role ?? 'TENANT',
                        otp,
                    },
                });
                const occurredAt = new Date().toISOString();
                const userCreated: UserCreatedEvent = {
                    eventId: randomUUID(),
                    occurredAt,
                    userId: user.userId,
                    email: user.email,
                    role: user.role ?? 'TENANT',
                };
                const otpRequested: OtpEmailRequestedEvent = {
                    eventId: randomUUID(),
                    occurredAt,
                    userId: user.userId,
                    email: user.email,
                    otp: String(otp),
                };
                this.logger.log(
                    `Publishing user-created and OTP-email events for user ${user.userId}`,
                    UserService.name,
                );
                await Promise.all([
                    lastValueFrom(this.events.emit(EVENT_PATTERN.auth.userCreated, userCreated)),
                    lastValueFrom(
                        this.events.emit(EVENT_PATTERN.auth.otpEmailRequested, otpRequested),
                    ),
                ]);
                this.logger.log(
                    `Kafka acknowledged both events for user ${user.userId}`,
                    UserService.name,
                );
                return {
                    userId: user.userId,
                };
            },
        });
    }

    async verifyEmail({ email, otp }: VerifyEmailDto) {
        return await this.apiHandler.handle({
            method: 'verifyOtp',
            logger: this.logger,
            successMessage: 'email_verified',
            errorMessage: 'failed_verify_email',
            fn: async () => {
                const userResponse = await this.findUserByUnique({ email });
                const user = userResponse?.success ? userResponse.data : undefined;

                if (!user) {
                    this.error.notFound('user_not_found', this.moduleName);
                }

                if (user.isVerified) {
                    this.error.conflict('email_already_verified', this.moduleName);
                }

                if (user.otp === null || user.otp !== otp) {
                    this.error.badRequest('invalid_otp', this.moduleName);
                }

                const userUpdate = await this.prisma.user.update({
                    where: { email },
                    data: { otp: null, isVerified: new Date() },
                });

                return { userId: userUpdate.userId };
            },
        });
    }
    async getAllUsers(query: Record<string, string | string[] | undefined>) {
        const { pagination, orderBy, filters, startDate, endDate } = extractRequestQueries<User>({
            query,

            orderBy: [
                {
                    createdAt: 'desc',
                },
            ],

            filters: ['email', 'userId', 'isActive', 'isBlocked', 'otp', 'role'],
        });

        const { email, userId, isActive, isBlocked, otp, role } = filters;

        const start = startDate ? convertToStartDate(startDate) : undefined;

        const end = endDate ? convertToEndDate(endDate) : undefined;

        return this.apiHandler.handle({
            method: 'getAll',
            logger: this.logger,
            successMessage: 'all_users_retrieved',

            fn: async () => {
                return this.prisma.user.findMany({
                    where: {
                        ...(email && {
                            email: {
                                contains: email,
                            },
                        }),

                        ...(userId && {
                            userId: {
                                contains: userId,
                            },
                        }),

                        ...(isActive !== undefined && {
                            isActive: isActive === 'true',
                        }),

                        ...(isBlocked !== undefined && {
                            isBlocked: isBlocked === 'true',
                        }),

                        ...(otp !== undefined && {
                            otp: Number(otp),
                        }),

                        ...(role && {
                            role: role as Role,
                        }),

                        ...((start || end) && {
                            createdAt: {
                                ...(start && {
                                    gte: start,
                                }),

                                ...(end && {
                                    lte: end,
                                }),
                            },
                        }),
                    },

                    ...pagination,

                    orderBy,
                });
            },
        });
    }

    async findUserByUnique({ email, userId }: { email?: string; userId?: string }) {
        if (email || userId) {
            return await this.apiHandler.handle({
                method: 'getBy',
                logger: this.logger,
                fn: async () => {
                    return await this.prisma.user.findUnique({
                        where: email ? { email } : { userId: userId },
                    });
                },
            });
        }

        this.logger.warn('User email or ID is required.', UserService.name);
        return undefined;
    }

    updateUser(updateUserDto: UpdateUserDto) {
        return `This action updates a #${updateUserDto.userId} user`;
    }

    async deleteUser(userId: string) {
        if (userId) {
            const userExist = await this.findUserByUnique({ userId });
            if (!userExist?.success) {
                this.error.notFound('user_not_found', this.moduleName);
            }
            return await this.apiHandler.handle({
                method: 'delete',
                logger: this.logger,
                successMessage: 'user_deleted',
                fn: async () =>
                    await this.prisma.user.delete({
                        where: { userId },
                        select: { userId: true },
                    }),
            });
        } else {
            this.logger.warn('User ID is required.', UserService.name);
            return this.apiHandler.createResponse({
                success: false,
                statusCode: 400,
                errors: { message: 'user_id_required' },
            });
        }
    }
}
