import {
    accessSettingsSchema,
    globalSettingsSchema,
    tokenSettingsSchema,
} from '@org/schemas/admin';
import { createZodDto } from 'nestjs-zod';

class GlobalSettingsDTO extends createZodDto(globalSettingsSchema) {}

class TokenSettingsDTO extends createZodDto(tokenSettingsSchema) {}
class AccessSettingsDTO extends createZodDto(accessSettingsSchema) {}

export { AccessSettingsDTO, GlobalSettingsDTO, TokenSettingsDTO };
