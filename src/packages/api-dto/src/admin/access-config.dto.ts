import { createOriginSchema, updateOriginSchema } from '@org/schemas/admin';
import { createZodDto } from 'nestjs-zod';

class CreateOriginDTO extends createZodDto(createOriginSchema) {}
class UpdateOriginDTO extends createZodDto(updateOriginSchema) {}

export { CreateOriginDTO, UpdateOriginDTO };
