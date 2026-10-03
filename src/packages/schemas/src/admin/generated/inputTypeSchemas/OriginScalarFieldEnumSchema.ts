import { z } from 'zod';

export const OriginScalarFieldEnumSchema = z.enum(['originId','origin','credentials','methods','allowedHeaders','exposedHeaders','accessSettingsId','createdAt','updatedAt']);

export default OriginScalarFieldEnumSchema;
