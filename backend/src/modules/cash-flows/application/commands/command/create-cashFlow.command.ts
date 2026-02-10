import { CashFlow } from '@/modules/cash-flows/domain/entities/cash-flow.entity';
import { Command } from '@nestjs/cqrs';

export class CreateCashFlowCommand extends Command<CashFlow> {
  constructor(
    public data: {
      userId: string;
      amount: number;
      type: 'INCOME' | 'EXPENSE';
      description: string | null;
      date: Date;
    },
  ) {
    super();
  }
}
