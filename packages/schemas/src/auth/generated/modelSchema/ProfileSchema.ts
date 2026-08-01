import { z } from 'zod';

/////////////////////////////////////////
// PROFILE SCHEMA
/////////////////////////////////////////

export const ProfileSchema = z.object({
  profileId: z.string(),
  userId: z.string(),
  fullName: z.string().nullable(),
  mobile: z.string().nullable(),
  address: z.string().nullable(),
})

export type Profile = z.infer<typeof ProfileSchema>

export default ProfileSchema;
