import { z } from 'zod';

export const PermissionScalarFieldEnumSchema = z.enum(['permissionId','moduleId','actionId','resource','createdAt','updatedAt']);

export default PermissionScalarFieldEnumSchema;
