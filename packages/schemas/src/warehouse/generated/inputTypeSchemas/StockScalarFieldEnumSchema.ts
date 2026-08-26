import { z } from 'zod';

export const StockScalarFieldEnumSchema = z.enum(['stockId','tenantId','warehouseId','locationId','itemId','quantity','createdAt','updatedAt']);

export default StockScalarFieldEnumSchema;
