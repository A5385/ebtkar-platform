import { Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProfileDto, UpdateProfileDto } from '@org/api-dto';
import { MESSAGE_PATTERN } from '@org/constants';
import { MICROSERVICE_CLIENT } from '../../../microservice';

@Controller('profile')
export class ProfileController {
    constructor(
        @Inject(MICROSERVICE_CLIENT.auth.name)
        private readonly authService: ClientProxy,
    ) {}

    @Post('create')
    createProfile(@Body() payload: CreateProfileDto) {
        return this.authService.send(MESSAGE_PATTERN.auth.profile.createProfile, payload);
    }

    @Patch('update')
    update(@Body() payload: UpdateProfileDto) {
        return this.authService.send(MESSAGE_PATTERN.auth.profile.updateProfile, payload);
    }

    @Get('find-profile-by-id/:profileId')
    findProfileById(@Param('profileId') profileId: string) {
        return this.authService.send(MESSAGE_PATTERN.auth.profile.getProfileById, profileId);
    }
    @Get('find-profile-By-user-id/:userId')
    findProfileByUserId(@Param('userId') userId: string) {
        return this.authService.send(MESSAGE_PATTERN.auth.profile.getProfileByUserId, userId);
    }
    @Get('find-profile-by-user-email/:userEmail')
    findProfileByUserEmail(@Param('userEmail') userEmail: string) {
        return this.authService.send(MESSAGE_PATTERN.auth.profile.getProfileByUserEmail, userEmail);
    }
}
