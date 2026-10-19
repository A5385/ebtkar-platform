import { z } from 'zod';

export const NetworkSettingsScalarFieldEnumSchema = z.enum(['id','httpClientRetries','requestTimeoutMs','paginationPageSize','retryDelay','retryStatusCodes','createdAt','updatedAt']);

export default NetworkSettingsScalarFieldEnumSchema;
