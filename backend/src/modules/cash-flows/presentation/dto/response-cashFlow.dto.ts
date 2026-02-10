import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const cashFlowResponseSchema = z.object({
  id: z.string().cuid2(),
  userId: z.string().cuid2(),
  amount: z.number(),
  type: z.enum(['INCOME', 'EXPENSE']),
  description: z.string().nullable(),
  date: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export class ResponseCashFlowDto extends createZodDto(cashFlowResponseSchema) {}
