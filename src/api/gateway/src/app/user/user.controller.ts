import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CheckEmailDto, CreateUserDto, UpdateUserDto, VerifyEmailDto } from '@org/api-dto';
import { MESSAGE_PATTERN } from '@org/constants';
import type { Request } from 'express';
import { MICROSERVICE_CLIENT } from '../../microservice';

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
    async register(@Body() dto: CreateUserDto) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.createUser, dto);
    }
    @Post('verify-email')
    async verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.verifyEmail, dto);
    }

    @Patch('update-user')
    async updateUser(@Body() dto: UpdateUserDto) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.updateUser, dto);
    }
    @Get('get-all-users')
    async getAllUsers(@Req() req: Request) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.getAllUsers, {
            query: req.query,
        });
    }
    @Get('find-user-by-id/:userId')
    async findUserById(@Param('userId') userId: string) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.findUserById, userId);
    }
    @Get('find-user-by-email/:email')
    async findUserByEmail(@Param('email') email: string) {
        return this.authService.send(MESSAGE_PATTERN.auth.user.findUserByEmail, email);
    }
    @Delete('delete-user/:userId')
    async deleteUser(@Param('userId') userId: string) {
        // console.log('🚀 >  UserController >  deleteUser >  userId:', userId);

        return this.authService.send(MESSAGE_PATTERN.auth.user.deleteUser, userId);
    }
}
