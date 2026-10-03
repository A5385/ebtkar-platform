import { z } from 'zod';

export const HttpMethodSchema = z.enum(['GET','POST','PUT','PATCH','DELETE','OPTIONS','HEAD']);

export type HttpMethodType = `${z.infer<typeof HttpMethodSchema>}`

export default HttpMethodSchema;
