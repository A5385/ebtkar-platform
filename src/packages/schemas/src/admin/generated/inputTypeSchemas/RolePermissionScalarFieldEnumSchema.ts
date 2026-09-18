import { z } from 'zod';

export const RolePermissionScalarFieldEnumSchema = z.enum(['rolePermissionId','roleId','permissionId']);

export default RolePermissionScalarFieldEnumSchema;
