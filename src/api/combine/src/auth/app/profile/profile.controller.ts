import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { CreateProfileDto, UpdateProfileDto } from '@org/api-dto';
import { MESSAGE_PATTERN } from '@org/constants';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @MessagePattern(MESSAGE_PATTERN.auth.profile.createProfile, Transport.TCP)
    async createProfile(@Payload() payload: CreateProfileDto) {
        return await this.profileService.createProfile(payload);
    }
    @MessagePattern(MESSAGE_PATTERN.auth.profile.updateProfile, Transport.TCP)
    async updateProfile(@Payload() payload: UpdateProfileDto) {
        return await this.profileService.updateProfile(payload);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.profile.getProfileById, Transport.TCP)
    async getProfileById(@Payload() profileId: string) {
        return await this.profileService.getProfileById(profileId);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.profile.getProfileByUserId, Transport.TCP)
    async getProfileByUserId(@Payload() userId: string) {
        return await this.profileService.getProfileByUserId(userId);
    }

    @MessagePattern(MESSAGE_PATTERN.auth.profile.getProfileByUserEmail, Transport.TCP)
    async getProfileByUserEmail(@Payload() email: string) {
        return await this.profileService.getProfileByUserEmail(email);
    }
}
