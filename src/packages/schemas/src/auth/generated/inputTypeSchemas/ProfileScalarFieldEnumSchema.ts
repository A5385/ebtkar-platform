import { z } from 'zod';

export const ProfileScalarFieldEnumSchema = z.enum(['profileId','fullName','mobile','address','image','userId','createdAt']);

export default ProfileScalarFieldEnumSchema;
