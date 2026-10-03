import { z } from 'zod';

export const RolesSchema = z.enum(['SUPER_ADMIN','ADMIN','TENANT']);

export type RolesType = `${z.infer<typeof RolesSchema>}`

export default RolesSchema;
