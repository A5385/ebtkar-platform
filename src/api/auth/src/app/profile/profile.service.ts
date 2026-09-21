import { Injectable } from '@nestjs/common';
import { CreateProfileDto, UpdateProfileDto } from '@org/api-dto';
import { ErrorService, ResponseHelperService, WinstonLoggerService } from '@org/api-shared';
import { AuthPrismaService } from '@org/database-auth';
import { DefaultUserMutationResponse, GetProfileResponseType } from '@org/schemas/auth';
import { ApiResponseType } from '@org/types';
import { UserService } from '../user/user.service';
import { profileSelect } from './profile.select';

@Injectable()
export class ProfileService {
    constructor(
        private readonly prisma: AuthPrismaService,
        private readonly apiHandler: ResponseHelperService,
        private readonly logger: WinstonLoggerService,
        private readonly error: ErrorService,
        private readonly userService: UserService,
    ) {}
    private moduleName = 'Profile';

    async createProfile({
        userId,
        ...data
    }: CreateProfileDto): Promise<ApiResponseType<DefaultUserMutationResponse>> {
        if (!userId) this.error.badRequest('user__is_required', this.moduleName);
        const userExist = await this.userService.findUserByIdentifier({ userId }, { userId: true });

        if (!userExist) this.error.notFound('user_not_fount', this.moduleName);

        return await this.apiHandler.handle({
            method: 'create',
            successMessage: 'user_profile_created_successfully',
            errorMessage: 'failed_create_user_profile',
            logger: this.logger,
            fn: async () =>
                await this.prisma.profile.create({
                    data: {
                        ...data,
                        user: { connect: { userId } },
                    },
                    select: { userId: true },
                }),
        });
    }

    async updateProfile({ profileId, ...data }: UpdateProfileDto) {
        if (!profileId) this.error.badRequest('profile_Id_is_required', this.moduleName);
        const profileExist = await this.prisma.profile.findUnique({ where: { profileId } });

        if (!profileExist) this.error.notFound('user_profile_is_no_longer_exist', this.moduleName);

        return await this.apiHandler.handle({
            method: 'update',
            logger: this.logger,
            successMessage: 'profile_updated_successfully',
            errorMessage: 'failed_update_profile',
            fn: async () =>
                await this.prisma.profile.update({
                    where: { profileId },
                    data,
                    select: { profileId: true },
                }),
        });
    }

    async getProfileById(profileId: string): Promise<ApiResponseType<GetProfileResponseType>> {
        if (!profileId) this.error.badRequest('profile_id_is_required', this.moduleName);

        return await this.apiHandler.handle({
            method: 'getById',
            logger: this.logger,
            fn: async () => {
                const profile = await this.prisma.profile.findUnique({
                    where: { profileId },
                    select: profileSelect,
                });
                const { user, ...rest } = profile ?? {};
                const { createdAt, updatedAt, ...restOfUser } = user ?? {};

                return { userCreateAt: createdAt, userUpdateAt: updatedAt, ...restOfUser, ...rest };
            },
        });
    }

    async getProfileByUserId(userId: string): Promise<ApiResponseType<GetProfileResponseType>> {
        if (!userId) this.error.badRequest('user_id_is_required', this.moduleName);

        const user = await this.userService.findUserByIdentifier({ userId });

        if (!user) this.error.notFound('user_not_fount', this.moduleName);

        return await this.apiHandler.handle({
            method: 'getBy',
            logger: this.logger,
            fn: async () => {
                const profile = await this.prisma.profile.findUnique({
                    where: { userId },
                    select: profileSelect,
                });
                const { user, ...rest } = profile ?? {};
                const { createdAt, updatedAt, ...restOfUser } = user ?? {};

                return { userCreateAt: createdAt, userUpdateAt: updatedAt, ...restOfUser, ...rest };
            },
        });
    }

    async getProfileByUserEmail(email: string): Promise<ApiResponseType<GetProfileResponseType>> {
        if (!email) this.error.badRequest('user_email_is_required', this.moduleName);

        const user = await this.userService.findUserByIdentifier({ email });

        if (!user) this.error.notFound('user_not_fount', this.moduleName);
        return await this.apiHandler.handle({
            method: 'getById',
            logger: this.logger,
            fn: async () => {
                const profile = await this.prisma.profile.findFirst({
                    where: { user: { email } },
                    select: profileSelect,
                });
                const { user, ...rest } = profile ?? {};
                const { createdAt, updatedAt, ...restOfUser } = user ?? {};

                return { userCreateAt: createdAt, userUpdateAt: updatedAt, ...restOfUser, ...rest };
            },
        });
    }
}
