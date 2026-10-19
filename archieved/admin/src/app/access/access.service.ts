import { Injectable } from '@nestjs/common';
import { CreateOriginDTO, UpdateOriginDTO } from '@org/api-dto';
import { ErrorService, ResponseHelperService, WinstonLoggerService } from '@org/api-shared';
import { AdminPrismaService } from '@org/database-admin';
import { AdminConfigPublisherService } from '../config/config.service.js';

@Injectable()
export class OriginService {
    private readonly moduleName = 'Admin Origin';

    constructor(
        private readonly prisma: AdminPrismaService,
        private readonly apiHandler: ResponseHelperService,
        private readonly logger: WinstonLoggerService,
        private readonly error: ErrorService,
        private readonly adminConfig: AdminConfigPublisherService,
    ) {}

    async create(dto: CreateOriginDTO) {
        return this.apiHandler.handle({
            method: 'create',
            successMessage: 'origin_successfully_created',
            logger: this.logger,
            fn: async () => {
                const origin = await this.prisma.origin.create({
                    data: {
                        origin: dto.origin,
                        credentials: dto.credentials,
                        methods: dto.methods,
                        allowedHeaders: dto.allowedHeaders,
                        exposedHeaders: dto.exposedHeaders,
                        accessSettings: {
                            connect: { id: true },
                        },
                    },
                });

                await this.adminConfig.commitUpdate('ACCESS');

                return origin;
            },
        });
    }

    async getAllOrigin() {
        return this.apiHandler.handle({
            method: 'getAll',
            successMessage: 'origins_successfully_retrieved',
            logger: this.logger,
            fn: () =>
                this.prisma.origin.findMany({
                    orderBy: { originId: 'asc' },
                }),
        });
    }

    async findOne(originId: string) {
        return this.apiHandler.handle({
            method: 'getById',
            successMessage: 'origin_successfully_retrieved',
            logger: this.logger,
            fn: async () => {
                this.validateOriginId(originId);

                const origin = await this.prisma.origin.findUnique({
                    where: { originId },
                });

                if (!origin) {
                    this.error.notFound('origin_not_found', this.moduleName);
                }

                return origin;
            },
        });
    }

    async findByAccessId(accessSettingsId: boolean) {
        return this.apiHandler.handle({
            method: 'getBy',
            successMessage: 'origins_successfully_retrieved',
            logger: this.logger,
            fn: async () => {
                if (typeof accessSettingsId !== 'boolean') {
                    this.error.badRequest('invalid_access_settings_id', this.moduleName);
                }

                return this.prisma.origin.findMany({
                    where: { accessSettingsId },
                    orderBy: { originId: 'asc' },
                });
            },
        });
    }

    async update(dto: UpdateOriginDTO) {
        return this.apiHandler.handle({
            method: 'update',
            successMessage: 'origin_successfully_updated',
            logger: this.logger,
            fn: async () => {
                this.validateOriginId(dto.originId);

                const origin = await this.prisma.origin.update({
                    where: { originId: dto.originId },
                    data: {
                        ...(dto.origin !== undefined ? { origin: dto.origin } : {}),
                        ...(dto.credentials !== undefined ? { credentials: dto.credentials } : {}),
                        ...(dto.methods !== undefined ? { methods: dto.methods } : {}),
                        ...(dto.allowedHeaders !== undefined
                            ? { allowedHeaders: dto.allowedHeaders }
                            : {}),
                        ...(dto.exposedHeaders !== undefined
                            ? { exposedHeaders: dto.exposedHeaders }
                            : {}),
                    },
                });

                await this.adminConfig.commitUpdate('ACCESS');

                return origin;
            },
        });
    }

    async remove(originId: string) {
        return this.apiHandler.handle({
            method: 'delete',
            successMessage: 'origin_successfully_deleted',
            logger: this.logger,
            fn: async () => {
                this.validateOriginId(originId);

                const origin = await this.prisma.origin.delete({
                    where: { originId },
                });

                await this.adminConfig.commitUpdate('ACCESS');

                return origin;
            },
        });
    }

    private validateOriginId(originId: string): void {
        if (typeof originId !== 'string' || originId.trim().length === 0) {
            this.error.badRequest('invalid_origin_id', this.moduleName);
        }
    }
}
