import { z } from 'zod';

export const ActionScalarFieldEnumSchema = z.enum(['actionId','name','createdAt']);

export default ActionScalarFieldEnumSchema;
