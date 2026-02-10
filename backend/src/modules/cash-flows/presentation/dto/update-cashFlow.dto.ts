import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const updateCashFlowSchema = z.object({
  amount: z.number().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  description: z.string().nullable().optional(),
  date: z.iso.datetime().optional(),
});

export class UpdateCashFlowDto extends createZodDto(updateCashFlowSchema) {}
