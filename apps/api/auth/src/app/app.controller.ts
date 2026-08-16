import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MSM_PATTERN } from '@repo/api-shared';

@Controller()
export class AppController {
    @MessagePattern(MSM_PATTERN['auth-service'].welcome)
    welcome() {
        return 'Welcome to auth service !';
    }
}
