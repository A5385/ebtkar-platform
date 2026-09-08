import { constants } from '@org/constants';
import z from 'zod';
import { emailValidation } from '../../zod-helper.js';
import UserSchema from '../generated/modelSchema/UserSchema.js';

export const CheckEmailSchema = UserSchema.pick({
    email: true,
}).extend({
    email: emailValidation,
});

export const CreateUserSchema = UserSchema.pick({
    email: true,
    role: true,
}).extend({
    email: emailValidation,
});

export const VerifyEmailSchema = CheckEmailSchema.extend({
    otp: z.number().min(constants.verifyEmailOtpLength, { error: 'otp_must_at_least' }),
});

export const UpdateUserSchema = CreateUserSchema.partial().extend({
    userId: z.string(),
});

export type CheckEmailSchemaFormType = z.infer<typeof CheckEmailSchema>;
export type VerifyEmailSchemaFormType = z.infer<typeof VerifyEmailSchema>;
export type CreateUserSchemaFormType = z.infer<typeof CreateUserSchema>;
export type UpdateUserSchemaFormType = z.infer<typeof UpdateUserSchema>;
