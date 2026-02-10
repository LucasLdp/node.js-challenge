import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createCashFlowSchema = z.object({
  amount: z.number(),
  type: z.enum(['INCOME', 'EXPENSE']),
  description: z.string().nullable(),
  date: z.iso.datetime(),
});

export class CreateCashFlowDto extends createZodDto(createCashFlowSchema) {}
