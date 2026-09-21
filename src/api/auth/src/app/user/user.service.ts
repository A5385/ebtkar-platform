import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
    ChangePasswordDto,
    CreateUserDto,
    SetNewPasswordDto,
    UpdateUserDto,
    VerifyEmailDto,
} from '@org/api-dto';
import {
    convertToEndDate,
    convertToStartDate,
    ErrorService,
    extractRequestQueries,
    ResponseHelperService,
    WinstonLoggerService,
} from '@org/api-shared';
import { EVENT_PATTERN } from '@org/constants';
import { AuthPrisma, AuthPrismaService } from '@org/database-auth';
import {
    CheckEmailResponseType,
    DefaultUserMutationResponse,
    DeleteUserResponseType,
    GetAllUserResponse,
    User,
    UserResponseType,
} from '@org/schemas/auth';
import type { ApiResponseType, OtpEmailRequestedEvent, UserCreatedEvent } from '@org/types';
import { randomInt, randomUUID } from 'node:crypto';
import { lastValueFrom } from 'rxjs';
import { compareHashedData, hashData } from '../../helpers/password-helper';
import { MICROSERVICE_CLIENT } from '../../microservice';
import { userSelect } from './user.select';

type UserPayload<T extends AuthPrisma.UserSelect> = AuthPrisma.UserGetPayload<{
    select: T;
}>;

type FindUniqueUserInput = {
    userId?: string;
    email?: string;
};
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

    async checkEmailExist(email: string): Promise<ApiResponseType<CheckEmailResponseType>> {
        return await this.apiHandler.handle({
            method: 'check',
            successMessage: 'email_availability_checked',
            logger: this.logger,
            fn: async () => {
                const user = await this.prisma.user.findUnique({ where: { email } });
                if (user && user) {
                    return { available: false };
                } else {
                    return { available: true };
                }
            },
        });
    }

    async createUser({
        email,
        role,
    }: CreateUserDto): Promise<ApiResponseType<DefaultUserMutationResponse>> {
        const exists = await this.findUserByIdentifier({ email }, { email: true });

        if (exists) {
            this.error.conflict('email_already_exists', this.moduleName);
        }

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
                        otp: await hashData(otp.toString()),
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

    async verifyEmail({
        email,
        otp,
    }: VerifyEmailDto): Promise<ApiResponseType<DefaultUserMutationResponse>> {
        return await this.apiHandler.handle({
            method: 'verifyOtp',
            logger: this.logger,
            successMessage: 'email_verified',
            errorMessage: 'failed_verify_email',
            fn: async () => {
                const user = await this.findUserByIdentifier(
                    { email },
                    { isVerified: true, otp: true },
                );

                if (!user) {
                    this.error.notFound('user_not_found', this.moduleName);
                }

                if (user.isVerified) {
                    this.error.conflict('email_already_verified', this.moduleName);
                }

                if (user.otp === null || !(await compareHashedData(otp, user.otp))) {
                    this.error.badRequest('invalid_otp', this.moduleName);
                }

                return await this.prisma.user.update({
                    where: { email },
                    data: {
                        otp: null,
                        isVerified: new Date(),
                    },
                    select: { userId: true },
                });
            },
        });
    }

    async getAllUsers(
        query: Record<string, string | string[] | undefined>,
    ): Promise<ApiResponseType<GetAllUserResponse>> {
        const { pagination, orderBy, filters, startDate, endDate } = extractRequestQueries<User>({
            query,
            orderBy: [
                {
                    createdAt: 'desc',
                },
            ],
            filters: ['email', 'userId', 'isActive', 'isBlocked', 'role'],
        });

        const { email, userId, isActive, isBlocked, role } = filters;

        const start = startDate ? convertToStartDate(startDate) : undefined;

        const end = endDate ? convertToEndDate(endDate) : undefined;

        return this.apiHandler.handle({
            method: 'getAll',
            logger: this.logger,
            successMessage: 'all_users_retrieved',
            fn: async () => {
                const users = await this.prisma.user.findMany({
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

                        ...(role && {
                            role: role,
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
                    select: userSelect,
                    ...pagination,
                    orderBy,
                });

                return users.map((user) => ({
                    userId: user?.userId,
                    email: user?.email,
                    role: user?.role,
                    isVerified: user?.isVerified,
                    isBlocked: user?.isBlocked,
                    isActive: user?.isActive,
                    isDelete: user?.isDelete,
                    deleteAt: user?.deleteAt,
                    createdAt: user?.createdAt,
                    updatedAt: user?.updatedAt,
                    profileId: user.profile?.profileId ?? null,
                    fullName: user.profile?.fullName ?? null,
                    mobile: user.profile?.mobile ?? null,
                    address: user.profile?.address ?? null,
                    profileCreatedAt: user.profile?.createdAt ?? null,
                }));
            },
        });
    }

    async getUserResponse({
        email,
        userId,
    }: FindUniqueUserInput): Promise<ApiResponseType<UserResponseType> | undefined> {
        if (!email && !userId) {
            this.logger.warn('User email or ID is required.', UserService.name);
            return undefined;
        }

        return await this.apiHandler.handle({
            method: 'getBy',
            logger: this.logger,
            fn: async () => {
                const user = await this.findUserByIdentifier({ email, userId }, userSelect);

                if (!user) {
                    this.error.notFound('user_not_found', this.moduleName);
                }

                return {
                    userId: user.userId,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                    isBlocked: user.isBlocked,
                    isActive: user.isActive,
                    isDelete: user.isDelete,
                    deleteAt: user.deleteAt,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    profileId: user.profile?.profileId ?? null,
                    fullName: user.profile?.fullName ?? null,
                    mobile: user.profile?.mobile ?? null,
                    address: user.profile?.address ?? null,
                    profileCreatedAt: user.profile?.createdAt ?? null,
                };
            },
        });
    }

    async findUserByIdentifier<T extends AuthPrisma.UserSelect>(
        { email, userId }: FindUniqueUserInput,
        select: T = userSelect as T,
    ): Promise<UserPayload<T> | null> {
        if (!email && !userId) {
            return null;
        }

        return this.prisma.user.findUnique({
            where: email ? { email } : { userId: userId },

            select,
        });
    }

    async setNewPassword({
        email,
        password,
    }: SetNewPasswordDto): Promise<ApiResponseType<DefaultUserMutationResponse>> {
        return await this.apiHandler.handle({
            method: 'update',
            logger: this.logger,
            successMessage: 'password_set_successfully',
            errorMessage: 'failed_set_password',
            fn: async () => {
                return await this.prisma.user.update({
                    where: { email },
                    data: { password: await hashData(password) },
                    select: { userId: true },
                });
            },
        });
    }

    async changePassword({
        email,
        oldPassword,
        newPassword,
    }: ChangePasswordDto): Promise<ApiResponseType<DefaultUserMutationResponse>> {
        if (!email || !oldPassword || !newPassword) {
            this.error.badRequest('invalid_input_data', this.moduleName);
        }

        if (!(await this.comparePassword({ email, password: oldPassword })))
            this.error.unauthorized('user_old_password_is_invalid', this.moduleName);

        return this.apiHandler.handle({
            method: 'update',
            successMessage: 'password_changed_successfully',
            errorMessage: 'failed_to_change_password',
            logger: this.logger,
            fn: async () => {
                return await this.prisma.user.update({
                    where: { email },
                    data: { password: newPassword },
                    select: { userId: true },
                });
            },
        });
    }

    async updateUser({
        email,
        isActive,
        isBlocked,
        role,
        password,
        otp,
        isVerified,
        isDelete,
    }: UpdateUserDto): Promise<ApiResponseType<DefaultUserMutationResponse>> {
        const user = await this.findUserByIdentifier({ email }, { userId: true });
        if (!user) this.error.notFound('user_not_found', this.moduleName);

        let hashedPassword: string | undefined = undefined;

        if (typeof password !== 'undefined') {
            hashedPassword = await hashData(password);
        }

        return await this.apiHandler.handle({
            method: 'update',
            logger: this.logger,
            successMessage: 'update_user_successfully',
            errorMessage: 'failed_update_user',
            fn: async () => {
                return await this.prisma.user.update({
                    where: { email },
                    data: {
                        ...(typeof password !== 'undefined' &&
                            hashedPassword && {
                                password: hashedPassword,
                            }),
                        ...(typeof isActive !== 'undefined' && { isActive }),
                        ...(typeof isBlocked !== 'undefined' && { isBlocked }),
                        ...(typeof isVerified !== 'undefined' && { isVerified }),
                        ...(typeof isDelete !== 'undefined' && { isDelete, deleteAt: new Date() }),
                        ...(typeof role !== 'undefined' && { role }),
                        ...(typeof otp !== 'undefined' && { otp }),
                    },
                    select: { userId: true },
                });
            },
        });
    }

    async deleteUser(email: string): Promise<ApiResponseType<DeleteUserResponseType>> {
        const userExist = await this.findUserByIdentifier({ email }, { userId: true });
        if (!userExist) {
            this.error.notFound('user_not_found', this.moduleName);
        }

        return await this.apiHandler.handle({
            method: 'delete',
            logger: this.logger,
            successMessage: 'user_deleted',
            fn: async () => {
                return await this.prisma.user.update({
                    where: { email },
                    data: {
                        isDelete: true,
                        deleteAt: new Date(),
                    },
                    select: { isDelete: true },
                });
            },
        });
    }

    async hardDeleteUser(email: string): Promise<ApiResponseType<DefaultUserMutationResponse>> {
        if (!email) this.error.badRequest('email_is_required', this.moduleName);

        const userExist = await this.findUserByIdentifier({ email }, { userId: true, email: true });
        if (!userExist) this.error.notFound('user_no_longer_exist', this.moduleName);

        const otp = randomInt(100_000, 1_000_000);

        await this.updateUser({
            email,
            otp: await hashData(otp.toString()),
        });

        const otpRequested: OtpEmailRequestedEvent = {
            eventId: randomUUID(),
            occurredAt: new Date().toISOString(),
            userId: userExist.userId,
            email: userExist.email,
            otp: String(otp),
        };

        await lastValueFrom(
            this.events.emit(EVENT_PATTERN.auth.otpVerifyUserHardDelete, otpRequested),
        );

        this.logger.log(
            `Kafka acknowledged both events for user ${userExist.email}`,
            UserService.name,
        );

        return {
            success: true,
            message: 'confirm_delete_otp_send_to_admin_email',
            statusCode: 201,
            data: { userId: userExist.userId },
        };
    }

    async confirmDeleteUser({
        email,
        otp,
    }: {
        email: string;
        otp: string;
    }): Promise<ApiResponseType<DefaultUserMutationResponse>> {
        if (!email || !otp) this.error.badRequest('invalid_data', this.moduleName);

        const userExist = await this.findUserByIdentifier({ email }, { userId: true });
        if (!userExist) this.error.notFound('user_no_longer_exist', this.moduleName);

        const validOtp = await this.compareOtp({
            email,
            otp,
        });

        if (!validOtp) {
            this.error.badRequest('invalid_otp', this.moduleName);
        }

        return await this.apiHandler.handle({
            method: 'delete',
            logger: this.logger,
            successMessage: 'user_paramountly_delete_successfully',
            fn: async () =>
                await this.prisma.user.delete({ where: { email }, select: { userId: true } }),
        });
    }

    async compareOtp({
        userId,
        email,
        otp,
    }: FindUniqueUserInput & {
        otp: string;
    }) {
        if ((userId || email) && otp) {
            const user = await this.findUserByIdentifier({ email, userId }, { otp: true });

            if (!user) return false;

            return await compareHashedData(otp, user.otp ?? '');
        } else {
            this.logger.error('userId or email or otp is required');
            return false;
        }
    }

    async comparePassword({
        userId,
        email,
        password,
    }: FindUniqueUserInput & {
        password: string;
    }) {
        if ((userId || email) && password) {
            const user = await this.findUserByIdentifier({ email, userId }, { password: true });

            if (!user) return false;

            return await compareHashedData(password, user.password ?? '');
        } else {
            this.logger.error('userId or email or Password is required');
            return false;
        }
    }
}
