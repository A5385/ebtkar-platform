import { z } from 'zod';

export const WarehouseScalarFieldEnumSchema = z.enum(['warehouseId','service','createdAt','updatedAt']);

export default WarehouseScalarFieldEnumSchema;
