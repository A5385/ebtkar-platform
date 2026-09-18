import { z } from 'zod';

export const RoleScalarFieldEnumSchema = z.enum(['roleId','name','description','isSuperAdmin','createdAt','updatedAt']);

export default RoleScalarFieldEnumSchema;
