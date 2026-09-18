import { z } from 'zod';

export const AppScalarFieldEnumSchema = z.enum(['appId','name','code','createdAt','updatedAt']);

export default AppScalarFieldEnumSchema;
