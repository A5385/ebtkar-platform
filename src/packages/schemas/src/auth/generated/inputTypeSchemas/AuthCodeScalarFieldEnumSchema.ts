import { z } from 'zod';

export const AuthCodeScalarFieldEnumSchema = z.enum(['id','code','accessToken','refreshToken','expiresAt','consumedAt','userId','createdAt']);

export default AuthCodeScalarFieldEnumSchema;
