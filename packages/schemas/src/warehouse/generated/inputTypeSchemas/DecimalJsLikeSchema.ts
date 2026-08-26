import { z } from 'zod';
import type { Prisma } from '../../../../../../database/warehouse/src/generated/prisma/client';

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.any(),
})

export default DecimalJsLikeSchema;
