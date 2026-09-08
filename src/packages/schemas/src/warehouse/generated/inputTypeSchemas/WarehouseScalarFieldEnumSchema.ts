import { z } from 'zod';

export const WarehouseScalarFieldEnumSchema = z.enum([
    'warehouseId',
    'tenantId',
    'code',
    'name',
    'isActive',
    'createdAt',
    'updatedAt',
]);

export default WarehouseScalarFieldEnumSchema;
