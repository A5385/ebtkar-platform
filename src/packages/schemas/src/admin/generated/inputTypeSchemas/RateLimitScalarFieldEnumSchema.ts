import { z } from 'zod';

export const RateLimitScalarFieldEnumSchema = z.enum(['rateLimitId','name','limit','ttl','networkSettingId','createdAt','updatedAt']);

export default RateLimitScalarFieldEnumSchema;
