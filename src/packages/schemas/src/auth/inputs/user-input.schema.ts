import { constants } from '@org/constants';
import z from 'zod';
import { emailValidation, strongPasswordValidation } from '../../zod-helper.js';
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

export const SetNewPasswordSchema = UserSchema.partial()
    .pick({
        email: true,
        password: true,
    })
    .extend({
        email: emailValidation,
        password: strongPasswordValidation,
    });

export const ChangePasswordSchema = z.object({
    email: emailValidation,
    oldPassword: z.string({ error: 'old_password_is_required' }),
    newPassword: strongPasswordValidation,
});

export const UpdateUserSchema = UserSchema.partial()
    .pick({
        email: true,
        role: true,
        otp: true,
        isBlocked: true,
        isActive: true,
    })
    .extend({
        email: emailValidation,
        password: strongPasswordValidation,
    });

export type CheckEmailSchemaFormType = z.infer<typeof CheckEmailSchema>;
export type VerifyEmailSchemaFormType = z.infer<typeof VerifyEmailSchema>;
export type CreateUserSchemaFormType = z.infer<typeof CreateUserSchema>;
export type SetNewPasswordSchemaFormType = z.infer<typeof SetNewPasswordSchema>;
export type ChangePasswordSchemaFormType = z.infer<typeof ChangePasswordSchema>;
export type UpdateUserSchemaFormType = z.infer<typeof UpdateUserSchema>;
