import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    ChangePasswordDto,
    CheckEmailDto,
    CreateUserDto,
    SetNewPasswordDto,
    UpdateUserDto,
    VerifyEmailDto,
} from '@org/api-dto';
import { MESSAGE_PATTERN } from '@org/constants';
import type { Request } from 'express';
import { MICROSERVICE_CLIENT } from '../../../microservice';

@Controller('user')
export class UserController {
    constructor(
        @Inject(MICROSERVICE_CLIENT.auth.name)
        private readonly authService: ClientProxy,
    ) {}

    @Post('check-email')
    checkEmail(@Body() dto: CheckEmailDto) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.checkEmail, dto);
    }

    @Post('create-user')
    createUser(@Body() dto: CreateUserDto) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.createUser, dto);
    }

    @Post('verify-email')
    verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.verifyEmail, dto);
    }

    @Post('set-new-password')
    setNewPassword(@Body() dto: SetNewPasswordDto) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.setNewPassword, dto);
    }

    @Post('change-password')
    changePassword(@Body() dto: ChangePasswordDto) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.changePassword, dto);
    }

    @Patch('update-user')
    updateUser(@Body() dto: UpdateUserDto) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.updateUser, dto);
    }

    @Get('get-all-users')
    getAllUsers(@Req() req: Request) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.getAllUsers, {
            query: req.query,
        });
    }

    @Get('find-user-by-id/:userId')
    findUserById(@Param('userId') userId: string) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.findUserById, userId);
    }

    @Get('find-user-by-email/:email')
    findUserByEmail(@Param('email') email: string) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.findUserByEmail, email);
    }

    @Delete('delete-user/:email')
    deleteUser(@Param('email') email: string) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.deleteUser, email);
    }

    @Delete('hard-delete-user/:email')
    hardDeleteUser(@Param('email') email: string) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.hardDeleteUser, email);
    }

    @Post('confirm-delete-user')
    confirmDeleteUser(
        @Body()
        payload: {
            email: string;
            otp: string;
        },
    ) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.confirmDeleteUser, payload);
    }
}
