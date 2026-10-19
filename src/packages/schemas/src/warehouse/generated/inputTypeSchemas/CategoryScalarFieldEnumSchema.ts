import { z } from 'zod';

export const CategoryScalarFieldEnumSchema = z.enum(['categoryId','tenantId','name','code','createdAt','updatedAt']);

export default CategoryScalarFieldEnumSchema;
