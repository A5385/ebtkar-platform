import { z } from 'zod';

export const NotificationTypeSchema = z.enum(['USER_CREATED','SYSTEM']);

export type NotificationTypeType = `${z.infer<typeof NotificationTypeSchema>}`

export default NotificationTypeSchema;
