import z from 'zod';
import OriginSchema from '../generated/modelSchema/OriginSchema.js';

const createOriginSchema = OriginSchema.omit({
    originId: true,
    accessSettingsId: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    origin: z.string().trim().min(1),
});

const updateOriginSchema = createOriginSchema
    .partial()
    .extend({
        originId: z.string().trim().min(1),
    })
    .refine(({ originId, ...patch }) => Object.values(patch).some((value) => value !== undefined), {
        message: 'At least one origin field must be provided.',
    });

type CreateOriginFormType = z.infer<typeof createOriginSchema>;
type UpdateOriginFormType = z.infer<typeof updateOriginSchema>;

export { createOriginSchema, updateOriginSchema };
export type { CreateOriginFormType, UpdateOriginFormType };
