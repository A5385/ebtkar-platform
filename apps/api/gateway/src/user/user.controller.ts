// apps\api\gateway\src\user\user.controller.ts
import { Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ChangePasswordDto, RegisterDto } from '@repo/api-dto';
import { MSM_PATTERN } from '@repo/api-shared';
import { MICROSERVICES_CLIENTS } from '../constants';

@Controller('user')
export class UserController {
    constructor(
        @Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE)
        private readonly authService: ClientProxy,
    ) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.send(MSM_PATTERN.user.register, dto);
    }
    @Get('get-all-users')
    getAllUsers() {
        return this.authService.send(MSM_PATTERN.user.getAll, {});
    }

    @Get('find-by-id/:userId')
    findUserById(@Param('userId') userId: string) {
        return this.authService.send(MSM_PATTERN.user.findById, { userId });
    }
    @Get('find-by-email/:email')
    findUserByEmail(@Param('email') email: string) {
        return this.authService.send(MSM_PATTERN.user.findByEmail, { email });
    }
    @Patch('change-password/:email')
    changePassword(@Param('email') email: string, @Body() dto: ChangePasswordDto) {
        return this.authService.send(MSM_PATTERN.user.changePassword, {
            email,
            ...dto,
        });
    }
}
