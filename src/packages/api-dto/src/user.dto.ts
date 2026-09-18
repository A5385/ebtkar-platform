import {
    ChangePasswordSchema,
    CheckEmailSchema,
    CreateUserSchema,
    SetNewPasswordSchema,
    UpdateUserSchema,
    VerifyEmailSchema,
} from '@org/schemas/auth';
import { createTypedZodDto } from './create-typed-zod-dto.js';

export class CheckEmailDto extends createTypedZodDto(CheckEmailSchema) {}

export class CreateUserDto extends createTypedZodDto(CreateUserSchema) {}

export class VerifyEmailDto extends createTypedZodDto(VerifyEmailSchema) {}
export class SetNewPasswordDto extends createTypedZodDto(SetNewPasswordSchema) {}
export class ChangePasswordDto extends createTypedZodDto(ChangePasswordSchema) {}

export class UpdateUserDto extends createTypedZodDto(UpdateUserSchema) {}
