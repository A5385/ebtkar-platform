import {
    accessSettingsSchema,
    globalSettingsSchema,
    networkSettingsSchema,
    tokenSettingsSchema,
} from '@org/schemas/admin';
import { createZodDto } from 'nestjs-zod';

class GlobalSettingsDTO extends createZodDto(globalSettingsSchema) {}
class NetworkSettingsDTO extends createZodDto(networkSettingsSchema) {}
class TokenSettingsDTO extends createZodDto(tokenSettingsSchema) {}
class AccessSettingsDTO extends createZodDto(accessSettingsSchema) {}

export { AccessSettingsDTO, GlobalSettingsDTO, NetworkSettingsDTO, TokenSettingsDTO };
