import { FindAllByUserIdCashFlowQuery } from '@/modules/cash-flows/application/queries/query';
import { CashFlow } from '@/modules/cash-flows/domain/entities/cash-flow.entity';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { CacheKeys, CacheTTL } from '@/shared/cache/cache-keys';
import { CacheService } from '@/shared/cache/cache.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindAllByUserIdCashFlowQuery)
export class FindAllByUserIdCashFlowHandler implements IQueryHandler<FindAllByUserIdCashFlowQuery> {
  constructor(
    private readonly cashFlowRepository: CashFlowRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute({
    userId,
    dateRange,
    limit = 10,
    page = 1,
  }: FindAllByUserIdCashFlowQuery): Promise<CashFlow[]> {
    const transformedDateRange = dateRange
      ? { from: dateRange.start, to: dateRange.end }
      : undefined;

    return this.cacheService.getOrSet({
      key: CacheKeys.cashFlows(userId, page, limit),
      ttl: CacheTTL.CASH_FLOWS,
      skipWhen: () => !!dateRange,
      fetch: () =>
        this.cashFlowRepository.findAllByUserId(
          userId,
          limit,
          page,
          transformedDateRange,
        ),
    });
  }
}
