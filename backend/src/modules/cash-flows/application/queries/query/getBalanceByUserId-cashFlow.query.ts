import { Query } from '@nestjs/cqrs';

export interface CashFlowBalance {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export class GetBalanceByUserIdCashFlowQuery extends Query<CashFlowBalance> {
  constructor(
    public userId: string,
    public dateRange?: { start: Date; end: Date },
  ) {
    super();
  }
}
