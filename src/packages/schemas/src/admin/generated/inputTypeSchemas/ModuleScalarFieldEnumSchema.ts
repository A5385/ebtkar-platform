import { z } from 'zod';

export const ModuleScalarFieldEnumSchema = z.enum(['moduleId','name','code','appId','createdAt','updatedAt']);

export default ModuleScalarFieldEnumSchema;
