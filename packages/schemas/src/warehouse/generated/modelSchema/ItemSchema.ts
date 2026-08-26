import { z } from 'zod';

/////////////////////////////////////////
// ITEM SCHEMA
/////////////////////////////////////////

export const ItemSchema = z.object({
  itemId: z.string(),
  tenantId: z.string(),
  sku: z.string(),
  name: z.string(),
  categoryId: z.string().nullable(),
  unit: z.string(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Item = z.infer<typeof ItemSchema>

export default ItemSchema;
