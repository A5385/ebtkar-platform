import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema.js'
import { NotificationAudienceSchema } from '../inputTypeSchemas/NotificationAudienceSchema.js'
import { NotificationTypeSchema } from '../inputTypeSchemas/NotificationTypeSchema.js'

/////////////////////////////////////////
// NOTIFICATION SCHEMA
/////////////////////////////////////////

export const NotificationSchema = z.object({
  audience: NotificationAudienceSchema,
  type: NotificationTypeSchema,
  notificationId: z.string(),
  eventId: z.string(),
  recipientId: z.string().nullable(),
  title: z.string(),
  message: z.string(),
  metadata: JsonValueSchema.nullable(),
  readAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
})

export type Notification = z.infer<typeof NotificationSchema>

export default NotificationSchema;
