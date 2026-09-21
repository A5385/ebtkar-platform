import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['userId','role','email','password','otp','isVerified','isBlocked','isActive','isDelete','deleteAt','createdAt','updatedAt']);

export default UserScalarFieldEnumSchema;
