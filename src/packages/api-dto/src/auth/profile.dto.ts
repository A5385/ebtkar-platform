import { CreateUserProfileSchema, UpdateUserProfileSchema } from '@org/schemas/auth';
import { createZodDto } from 'nestjs-zod';

export class CreateProfileDto extends createZodDto(CreateUserProfileSchema) {}
export class UpdateProfileDto extends createZodDto(UpdateUserProfileSchema) {}
