import {
  CashFlowBalance,
  GetBalanceByUserIdCashFlowQuery,
} from '@/modules/cash-flows/application/queries/query';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetBalanceByUserIdCashFlowQuery)
export class GetBalanceByUserIdCashFlowHandler implements IQueryHandler<GetBalanceByUserIdCashFlowQuery> {
  constructor(private readonly cashFlowRepository: CashFlowRepository) {}

  async execute({
    userId,
    dateRange,
  }: GetBalanceByUserIdCashFlowQuery): Promise<CashFlowBalance> {
    const transformedDateRange = dateRange
      ? { from: dateRange.start, to: dateRange.end }
      : undefined;

    return this.cashFlowRepository.getBalanceByUserId(
      userId,
      transformedDateRange,
    );
  }
}
