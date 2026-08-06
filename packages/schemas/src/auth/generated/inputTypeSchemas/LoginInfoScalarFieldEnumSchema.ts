import { z } from 'zod';

export const LoginInfoScalarFieldEnumSchema = z.enum(['id','userId','lastLogin','code','at','rt']);

export default LoginInfoScalarFieldEnumSchema;
