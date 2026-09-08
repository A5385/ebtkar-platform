import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { CheckEmailDto, CreateUserDto, UpdateUserDto, VerifyEmailDto } from '@org/api-dto';
import { MESSAGE_PATTERN } from '@org/constants';
import { CheckEmailResponseType, CreateUserResponseType } from '@org/schemas/auth';
import { type EndPointResponseType } from '@org/types';
import { UserService } from './user.service';

type GetAllUsersPayload = {
    query: Record<string, string | string[] | undefined>;
};

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @MessagePattern(MESSAGE_PATTERN.auth.user.checkEmail, Transport.TCP)
    async checkEmailExist(
        @Payload() dto: CheckEmailDto,
    ): EndPointResponseType<CheckEmailResponseType> {
        return await this.userService.checkEmailExist(dto.email);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.createUser, Transport.TCP)
    async createUser(
        @Payload() createUserDto: CreateUserDto,
    ): EndPointResponseType<CreateUserResponseType> {
        return await this.userService.createUser(createUserDto);
    }
    @MessagePattern(MESSAGE_PATTERN.auth.user.verifyEmail, Transport.TCP)
    async verifyEmail(
        @Payload() dto: VerifyEmailDto,
    ): EndPointResponseType<CreateUserResponseType> {
        return await this.userService.verifyEmail(dto);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.getAllUsers, Transport.TCP)
    async getAllUsers(@Payload() payload: GetAllUsersPayload) {
        return this.userService.getAllUsers(payload.query);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.findUserByEmail, Transport.TCP)
    async findUserByEmail(@Payload() email: string) {
        return await this.userService.findUserByUnique({ email });
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.findUserById, Transport.TCP)
    async findUserById(@Payload() userId: string) {
        return await this.userService.findUserByUnique({ userId });
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.updateUser, Transport.TCP)
    async updateUser(@Payload() updateUserDto: UpdateUserDto) {
        return await this.userService.updateUser(updateUserDto);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.deleteUser, Transport.TCP)
    async deleteUser(@Payload() userId: string) {
        // console.log("🚀 >  UserController >  deleteUser >  userId:", userId);

        return await this.userService.deleteUser(userId);
    }
}
