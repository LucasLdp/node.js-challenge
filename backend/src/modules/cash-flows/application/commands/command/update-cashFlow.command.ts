import { CashFlow } from '@/modules/cash-flows/domain/entities/cash-flow.entity';
import { Command } from '@nestjs/cqrs';

export class UpdateCashFlowCommand extends Command<CashFlow> {
  constructor(
    public id: string,
    public data: {
      amount?: number;
      type?: 'INCOME' | 'EXPENSE';
      description?: string | null;
      date?: Date;
    },
  ) {
    super();
  }
}
