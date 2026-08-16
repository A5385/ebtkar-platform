import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MSM_PATTERN } from '@repo/api-shared';

@Controller()
export class AppController {
    @MessagePattern(MSM_PATTERN['warehouse-service'].welcome)
    welcome() {
        return 'Welcome to warehouse service !';
    }
}
