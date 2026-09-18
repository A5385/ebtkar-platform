import { z } from 'zod';

export const NetworkSettingsScalarFieldEnumSchema = z.enum(['id','httpClientRetries','requestTimeoutMs','createdAt','updatedAt']);

export default NetworkSettingsScalarFieldEnumSchema;
