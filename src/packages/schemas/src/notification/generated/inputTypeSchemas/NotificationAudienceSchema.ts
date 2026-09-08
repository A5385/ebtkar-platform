import { z } from 'zod';

export const NotificationAudienceSchema = z.enum(['ADMIN','USER']);

export type NotificationAudienceType = `${z.infer<typeof NotificationAudienceSchema>}`

export default NotificationAudienceSchema;
