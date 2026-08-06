import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangePasswordDto, RegisterDto } from '@repo/api-dto';
import { MSM_PATTERN } from '@repo/api-shared';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @MessagePattern(MSM_PATTERN.user.register)
    register(@Payload() dto: RegisterDto) {
        return this.userService.register(dto);
    }

    @MessagePattern(MSM_PATTERN.user.getAll)
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }

    @MessagePattern(MSM_PATTERN.user.findById)
    async findUserById(@Payload() dto: { userId: string }) {
        return await this.userService.findUserById(dto.userId);
    }

    @MessagePattern(MSM_PATTERN.user.findByEmail)
    async findUserByEmail(@Payload() dto: { email: string }) {
        return await this.userService.findUserByEmail(dto.email);
    }
    @MessagePattern(MSM_PATTERN.user.changePassword)
    async changePassword(
        @Payload()
        data: ChangePasswordDto & { email: string },
    ) {
        const { email, ...dto } = data;

        return await this.userService.changeUserPassword(email, dto);
    }
}
