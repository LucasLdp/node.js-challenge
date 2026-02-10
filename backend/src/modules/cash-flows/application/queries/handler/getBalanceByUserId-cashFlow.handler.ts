import {
  CashFlowBalance,
  GetBalanceByUserIdCashFlowQuery,
} from '@/modules/cash-flows/application/queries/query';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { CacheKeys, CacheTTL } from '@/shared/cache/cache-keys';
import { CacheService } from '@/shared/cache/cache.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetBalanceByUserIdCashFlowQuery)
export class GetBalanceByUserIdCashFlowHandler implements IQueryHandler<GetBalanceByUserIdCashFlowQuery> {
  constructor(
    private readonly cashFlowRepository: CashFlowRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute({
    userId,
    dateRange,
  }: GetBalanceByUserIdCashFlowQuery): Promise<CashFlowBalance> {
    const transformedDateRange = dateRange
      ? { from: dateRange.start, to: dateRange.end }
      : undefined;

    return this.cacheService.getOrSet({
      key: CacheKeys.balance(userId),
      ttl: CacheTTL.BALANCE,
      skipWhen: () => !!dateRange,
      fetch: () =>
        this.cashFlowRepository.getBalanceByUserId(
          userId,
          transformedDateRange,
        ),
    });
  }
}
