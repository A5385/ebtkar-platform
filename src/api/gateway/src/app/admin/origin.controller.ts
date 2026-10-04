import { CacheTTL } from '@nestjs/cache-manager';
import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseBoolPipe,
    Patch,
    Post,
    Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOriginDTO, UpdateOriginDTO } from '@org/api-dto';
import { MICROSERVICE_CLIENT } from '@org/api-shared';
import { MESSAGE_PATTERN } from '@org/constants';
import type { Request } from 'express';
@CacheTTL(-1)
@Controller('admin-origin')
export class AdminOriginController {
    constructor(
        @Inject(MICROSERVICE_CLIENT.combine.name)
        private readonly adminService: ClientProxy,
    ) {}

    @Post('create-origin')
    create(@Body() dto: CreateOriginDTO) {
        return this.adminService.send(MESSAGE_PATTERN.admin.access.create, dto);
    }

    @Get('get-all-origins')
    getAllOrigin(@Req() req: Request) {
        return this.adminService.send(MESSAGE_PATTERN.admin.access.getAll, { query: req.query });
    }

    @Get('find-origin-by-id/:originId')
    findOne(@Param('originId') originId: string) {
        return this.adminService.send(MESSAGE_PATTERN.admin.access.findById, originId);
    }

    @Get('find-origins-by-access-id/:accessSettingsId')
    findByAccessId(
        @Param('accessSettingsId', ParseBoolPipe)
        accessSettingsId: boolean,
    ) {
        return this.adminService.send(
            MESSAGE_PATTERN.admin.access.findByAccessId,
            accessSettingsId,
        );
    }

    @Patch('update-origin')
    update(@Body() dto: UpdateOriginDTO) {
        return this.adminService.send(MESSAGE_PATTERN.admin.access.update, dto);
    }

    @Delete('delete-origin/:originId')
    remove(@Param('originId') originId: string) {
        return this.adminService.send(MESSAGE_PATTERN.admin.access.delete, originId);
    }
}
