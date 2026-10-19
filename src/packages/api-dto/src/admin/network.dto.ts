import { networkSettingsSchema } from '@org/schemas/admin';
import { createZodDto } from 'nestjs-zod';

class NetworkSettingsDTO extends createZodDto(networkSettingsSchema) {}

export { NetworkSettingsDTO };
