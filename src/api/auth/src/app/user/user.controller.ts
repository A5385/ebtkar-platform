import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';

import {
    ChangePasswordDto,
    CheckEmailDto,
    CreateUserDto,
    SetNewPasswordDto,
    UpdateUserDto,
    VerifyEmailDto,
} from '@org/api-dto';

import { MESSAGE_PATTERN } from '@org/constants';

import { UserService } from './user.service';

type GetAllUsersPayload = {
    query: Record<string, string | string[] | undefined>;
};

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @MessagePattern(MESSAGE_PATTERN.auth.user.checkEmail, Transport.TCP)
    async checkEmailExist(@Payload() dto: CheckEmailDto) {
        return await this.userService.checkEmailExist(dto.email);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.createUser, Transport.TCP)
    async createUser(@Payload() dto: CreateUserDto) {
        return await this.userService.createUser(dto);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.verifyEmail, Transport.TCP)
    async verifyEmail(@Payload() dto: VerifyEmailDto) {
        return await this.userService.verifyEmail(dto);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.setNewPassword, Transport.TCP)
    async setNewPassword(@Payload() dto: SetNewPasswordDto) {
        return await this.userService.setNewPassword(dto);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.changePassword, Transport.TCP)
    async changePassword(@Payload() dto: ChangePasswordDto) {
        return await this.userService.changePassword(dto);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.updateUser, Transport.TCP)
    async updateUser(@Payload() dto: UpdateUserDto) {
        return await this.userService.updateUser(dto);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.getAllUsers, Transport.TCP)
    async getAllUsers(@Payload() payload: GetAllUsersPayload) {
        return await this.userService.getAllUsers(payload.query);
    }
    @MessagePattern(MESSAGE_PATTERN.auth.user.findUserById, Transport.TCP)
    async findUserById(@Payload() userId: string) {
        return await this.userService.getUserResponse({
            userId,
        });
    }
    @MessagePattern(MESSAGE_PATTERN.auth.user.findUserByEmail, Transport.TCP)
    async findUserByEmail(@Payload() email: string) {
        return await this.userService.getUserResponse({
            email,
        });
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.deleteUser, Transport.TCP)
    async deleteUser(@Payload() email: string) {
        return await this.userService.deleteUser(email);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.hardDeleteUser, Transport.TCP)
    async hardDeleteUser(@Payload() email: string) {
        return await this.userService.hardDeleteUser(email);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.user.confirmDeleteUser, Transport.TCP)
    async confirmDeleteUser(@Payload() payload: { email: string; otp: string }) {
        return await this.userService.confirmDeleteUser(payload);
    }
}
