import z from 'zod';
import ProfileSchema from '../generated/modelSchema/ProfileSchema.js';

export const CreateUserProfileSchema = ProfileSchema.pick({
    userId: true,
    fullName: true,
    mobile: true,
    address: true,
}).required({ userId: true });

export const UpdateUserProfileSchema = CreateUserProfileSchema.omit({ userId: true })
    .partial()
    .extend({ profileId: z.string({ error: 'profile_id_is_required' }) })
    .required({ profileId: true });

export type CreateProfileSchemaFormType = z.infer<typeof CreateUserProfileSchema>;
export type UpdateProfileSchemaFromType = z.infer<typeof UpdateUserProfileSchema>;
