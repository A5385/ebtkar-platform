import { Injectable } from '@nestjs/common';
import { ChangePasswordDto, RegisterDto } from '@repo/api-dto';
import { ErrorService, handleApiResponse, WinstonLoggerService } from '@repo/api-shared';
import { AuthPrismaService } from '@repo/auth-database';
import { Prisma } from '@repo/auth-database/generated/prisma/client';
import { hashPassword, validatePassword } from '@repo/helpers';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: AuthPrismaService,
        private readonly error: ErrorService,
        private readonly logger: WinstonLoggerService,
    ) {}

    private readonly moduleName = 'user';

    private readonly defaultUser = {
        userId: true,
        email: true,
    } satisfies Prisma.UserSelect;

    private get shared() {
        return {
            moduleName: this.moduleName,
            logger: this.logger,
        };
    }

    async register({ email, password }: RegisterDto) {
        if (!email || !password) {
            this.error.badRequest('email_and_password_are_required', this.moduleName);
        }

        const hashedPassword = await hashPassword(password);

        return handleApiResponse({
            ...this.shared,
            method: 'create',
            fn: () =>
                this.prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                    },
                    select: this.defaultUser,
                }),
        });
    }

    async findUserByUnique<T extends Prisma.UserSelect>(
        where: Prisma.UserWhereUniqueInput,
        select: T,
    ) {
        const email = where.email;
        const userId = where.userId;

        if (!email && !userId) {
            this.error.badRequest('user_id_or_email_is_required', this.moduleName);
        }

        return handleApiResponse<Prisma.UserGetPayload<{ select: T }> | null>({
            ...this.shared,
            method: 'find-by',
            getBy: {
                key: email ? 'email' : 'userId',
                value: email ?? userId ?? '',
            },
            fn: () =>
                this.prisma.user.findUnique({
                    where,
                    select,
                }),
        });
    }

    async findUserByEmail(email: string, select: Prisma.UserSelect = this.defaultUser) {
        if (!email) {
            this.error.badRequest('email_is_required', this.moduleName);
        }

        return this.findUserByUnique({ email }, select);
    }

    async findUserById(userId: string, select: Prisma.UserSelect = this.defaultUser) {
        if (!userId) {
            this.error.badRequest('user_id_is_required', this.moduleName);
        }

        return this.findUserByUnique({ userId }, select);
    }

    async getAllUsers(select: Prisma.UserSelect = this.defaultUser) {
        return handleApiResponse({
            ...this.shared,
            method: 'get-all',
            fn: () => this.prisma.user.findMany({ select }),
        });
    }

    async validateUserPassword(
        email: string,
        password: string,
        select: Prisma.UserSelect = {
            ...this.defaultUser,
            password: true,
        },
    ) {
        if (!email || !password) {
            this.error.badRequest('email_and_password_are_required', this.moduleName);
        }

        const result = await this.findUserByEmail(email, select);
        const user = result && result.payload;

        // Keep the same public error for invalid email and invalid password.
        if (!user?.password) {
            this.error.unauthorized('email_or_password_do_not_match', this.moduleName);
        }

        const passwordMatches = await validatePassword(password, user.password);

        if (!passwordMatches) {
            this.error.unauthorized('email_or_password_do_not_match', this.moduleName);
        }

        return user;
    }

    async updateUser(
        email: string,
        {
            password,
            ...data
        }: Pick<
            Prisma.UserUpdateInput,
            'otp' | 'isVerified' | 'isBlocked' | 'isActive' | 'password'
        >,
    ) {
        let hashedPassword: string | undefined;
        if (password) {
            hashedPassword = await hashPassword(password as string);
        }

        return await handleApiResponse({
            ...this.shared,
            method: 'update',
            fn: () =>
                this.prisma.user.update({
                    where: { email },
                    data: {
                        ...data,
                        ...(hashedPassword && { password: hashedPassword }),
                    },
                    select: this.defaultUser,
                }),
        });
    }

    async changeUserPassword(email: string, { oldPassword, newPassword }: ChangePasswordDto) {
        if (!email || !oldPassword || !newPassword) {
            this.error.badRequest('password_change_data_is_required', this.moduleName);
        }

        await this.validateUserPassword(email, oldPassword);

        return await this.updateUser(email, { password: newPassword });
    }
}
