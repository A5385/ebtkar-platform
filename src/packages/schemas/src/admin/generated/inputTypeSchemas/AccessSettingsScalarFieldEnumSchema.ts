import { z } from 'zod';

export const AccessSettingsScalarFieldEnumSchema = z.enum(['id','corsEnabled','createdAt','updatedAt']);

export default AccessSettingsScalarFieldEnumSchema;
