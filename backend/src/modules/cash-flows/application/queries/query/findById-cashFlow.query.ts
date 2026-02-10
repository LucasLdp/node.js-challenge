import { CashFlow } from '@/modules/cash-flows/domain/entities/cash-flow.entity';
import { Query } from '@nestjs/cqrs';

export class FindByIdCashFlowQuery extends Query<CashFlow> {
  constructor(public id: string) {
    super();
  }
}
