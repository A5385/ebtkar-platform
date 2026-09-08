import { z } from 'zod';

export const WarehouseLocationScalarFieldEnumSchema = z.enum([
    'locationId',
    'warehouseId',
    'name',
    'code',
    'createdAt',
    'updatedAt',
]);

export default WarehouseLocationScalarFieldEnumSchema;
