import { z } from 'zod';

export const LoginEventScalarFieldEnumSchema = z.enum(['id','loginAt','ipAddress','service','userAgent','userId','createdAt']);

export default LoginEventScalarFieldEnumSchema;
