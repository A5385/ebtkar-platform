import { z } from 'zod';

export const TokensConfigScalarFieldEnumSchema = z.enum(['id','accessTokenExp','refreshTokenExp','createdAt','updatedAt']);

export default TokensConfigScalarFieldEnumSchema;
