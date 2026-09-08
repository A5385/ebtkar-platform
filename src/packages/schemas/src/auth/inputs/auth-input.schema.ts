import { emailValidation, strongPasswordValidation } from '../../zod-helper.js';
import UserSchema from '../generated/modelSchema/UserSchema.js';

export const LoginSchema = UserSchema.pick({
    email: true,
    password: true,
})
    .required({ email: true, password: true })
    .extend({
        email: emailValidation,
        password: strongPasswordValidation,
    });
