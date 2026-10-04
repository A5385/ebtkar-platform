import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOriginDTO, UpdateOriginDTO } from '@org/api-dto';
import { MESSAGE_PATTERN } from '@org/constants';
import { OriginService } from './access.service.js';

type PayloadQuery = {
    query: Record<string, string | string[] | undefined>;
};

@Controller()
export class OriginController {
    constructor(private readonly originService: OriginService) {}

    @MessagePattern(MESSAGE_PATTERN.admin.access.create)
    create(@Payload() dto: CreateOriginDTO) {
        return this.originService.create(dto);
    }

    @MessagePattern(MESSAGE_PATTERN.admin.access.getAll)
    getAllOrigin(@Payload() payload: PayloadQuery) {
        return this.originService.getAllOrigin(payload.query);
    }

    @MessagePattern(MESSAGE_PATTERN.admin.access.findById)
    findOne(@Payload() originId: string) {
        return this.originService.findOne(originId);
    }

    @MessagePattern(MESSAGE_PATTERN.admin.access.findByAccessId)
    findByAccessId(@Payload() accessSettingsId: boolean) {
        return this.originService.findByAccessId(accessSettingsId);
    }

    @MessagePattern(MESSAGE_PATTERN.admin.access.update)
    update(@Payload() dto: UpdateOriginDTO) {
        return this.originService.update(dto);
    }

    @MessagePattern(MESSAGE_PATTERN.admin.access.delete)
    remove(@Payload() originId: string) {
        return this.originService.remove(originId);
    }
}
