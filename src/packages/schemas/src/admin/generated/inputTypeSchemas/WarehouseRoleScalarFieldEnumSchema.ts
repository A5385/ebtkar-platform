import { z } from 'zod';

export const WarehouseRoleScalarFieldEnumSchema = z.enum(['warehouseRoleId','name','code','description','isSuperAdmin','warehouseSettingsId','permissions','createdAt','updatedAt']);

export default WarehouseRoleScalarFieldEnumSchema;
