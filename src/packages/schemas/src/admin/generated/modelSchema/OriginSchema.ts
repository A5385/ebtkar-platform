import { z } from 'zod';
import { HttpMethodSchema } from '../inputTypeSchemas/HttpMethodSchema.js'

/////////////////////////////////////////
// ORIGIN SCHEMA
/////////////////////////////////////////

export const OriginSchema = z.object({
  methods: HttpMethodSchema.array(),
  originId: z.string(),
  origin: z.string(),
  credentials: z.boolean(),
  allowedHeaders: z.string().array(),
  exposedHeaders: z.string().array(),
  accessSettingsId: z.boolean().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Origin = z.infer<typeof OriginSchema>

export default OriginSchema;
