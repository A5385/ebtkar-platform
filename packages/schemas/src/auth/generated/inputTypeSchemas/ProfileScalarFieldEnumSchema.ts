import { z } from 'zod';

export const ProfileScalarFieldEnumSchema = z.enum(['profileId','userId','fullName','mobile','address']);

export default ProfileScalarFieldEnumSchema;
