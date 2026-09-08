import { z } from 'zod';

export const NotificationScalarFieldEnumSchema = z.enum(['notificationId','eventId','audience','recipientId','type','title','message','metadata','readAt','createdAt']);

export default NotificationScalarFieldEnumSchema;
