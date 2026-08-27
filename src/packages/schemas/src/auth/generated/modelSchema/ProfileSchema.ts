import { z } from 'zod';

/////////////////////////////////////////
// PROFILE SCHEMA
/////////////////////////////////////////

export const ProfileSchema = z.object({
  profileId: z.string(),
  fullName: z.string().nullable(),
  mobile: z.string().nullable(),
  address: z.string().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date(),
})

export type Profile = z.infer<typeof ProfileSchema>

export default ProfileSchema;
