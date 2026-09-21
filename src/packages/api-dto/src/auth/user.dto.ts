import {
    ChangePasswordSchema,
    CheckEmailSchema,
    CreateUserSchema,
    SetNewPasswordSchema,
    UpdateUserSchema,
    VerifyEmailSchema,
} from '@org/schemas/auth';
import { createZodDto } from 'nestjs-zod';

export class CheckEmailDto extends createZodDto(CheckEmailSchema) {}

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export class VerifyEmailDto extends createZodDto(VerifyEmailSchema) {}

export class SetNewPasswordDto extends createZodDto(SetNewPasswordSchema) {}

export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
