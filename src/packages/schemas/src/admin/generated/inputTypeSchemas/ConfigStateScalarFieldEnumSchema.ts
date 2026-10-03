import { z } from 'zod';

export const ConfigStateScalarFieldEnumSchema = z.enum(['id','version','createdAt','updatedAt']);

export default ConfigStateScalarFieldEnumSchema;
