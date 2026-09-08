import { z } from 'zod';

export const ItemScalarFieldEnumSchema = z.enum([
    'itemId',
    'tenantId',
    'sku',
    'name',
    'categoryId',
    'unit',
    'isActive',
    'createdAt',
    'updatedAt',
]);

export default ItemScalarFieldEnumSchema;
