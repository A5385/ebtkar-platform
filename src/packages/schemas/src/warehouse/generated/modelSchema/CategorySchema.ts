import { z } from 'zod';

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
    categoryId: z.string(),
    tenantId: z.string(),
    name: z.string(),
    code: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type Category = z.infer<typeof CategorySchema>;

export default CategorySchema;
