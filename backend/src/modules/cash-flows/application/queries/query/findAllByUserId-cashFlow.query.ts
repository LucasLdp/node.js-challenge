import { CashFlow } from '@/modules/cash-flows/domain/entities/cash-flow.entity';
import { Query } from '@nestjs/cqrs';

export class FindAllByUserIdCashFlowQuery extends Query<CashFlow[]> {
  constructor(
    public userId: string,
    public limit?: number,
    public page?: number,
    public dateRange?: { start: Date; end: Date },
  ) {
    super();
  }
}
