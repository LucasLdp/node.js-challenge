import { GetBalanceByUserIdCashFlowQuery } from '@/modules/cash-flows/application/queries/query';
import { GetBalanceByUserIdCashFlowHandler } from '@/modules/cash-flows/application/queries/handler/getBalanceByUserId-cashFlow.handler';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { CacheService } from '@/shared/cache/cache.service';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'vitest-mock-extended';
import { describe, it, expect, beforeEach } from 'vitest';

describe('GetBalanceByUserIdCashFlowHandler', () => {
  const cashFlowRepositoryMock = mock<CashFlowRepository>();
  const cacheServiceMock = mock<CacheService>();
  let handler: GetBalanceByUserIdCashFlowHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetBalanceByUserIdCashFlowHandler,
        {
          provide: CashFlowRepository,
          useValue: cashFlowRepositoryMock,
        },
        {
          provide: CacheService,
          useValue: cacheServiceMock,
        },
      ],
    }).compile();

    handler = module.get<GetBalanceByUserIdCashFlowHandler>(
      GetBalanceByUserIdCashFlowHandler,
    );
    mockReset(cashFlowRepositoryMock);
    mockReset(cacheServiceMock);

    cacheServiceMock.getOrSet.mockImplementation(async ({ fetch }) => fetch());
  });

  it('should call cache service with correct parameters', async () => {
    const userId = 'user-123';
    const balance = {
      totalIncome: 1500,
      totalExpense: 300,
      balance: 1200,
    };
    cashFlowRepositoryMock.getBalanceByUserId.mockResolvedValueOnce(balance);

    const query = new GetBalanceByUserIdCashFlowQuery(userId);
    const result = await handler.execute(query);

    expect(cacheServiceMock.getOrSet).toHaveBeenCalledWith(
      expect.objectContaining({
        key: `cash-flow:balance:${userId}`,
        ttl: 30000,
      }),
    );
    expect(result).toEqual(balance);
  });

  it('should not skip cache when no date range', async () => {
    const userId = 'user-123';
    const balance = { totalIncome: 1500, totalExpense: 300, balance: 1200 };
    cashFlowRepositoryMock.getBalanceByUserId.mockResolvedValueOnce(balance);

    const query = new GetBalanceByUserIdCashFlowQuery(userId);
    await handler.execute(query);

    const callArg = cacheServiceMock.getOrSet.mock.calls[0][0];
    expect(callArg.skipWhen?.()).toBe(false);
  });

  it('should skip cache when date range is provided', async () => {
    const userId = 'user-123';
    const dateRange = {
      start: new Date('2026-01-01'),
      end: new Date('2026-01-31'),
    };
    const balance = {
      totalIncome: 500,
      totalExpense: 200,
      balance: 300,
    };
    cashFlowRepositoryMock.getBalanceByUserId.mockResolvedValueOnce(balance);

    const query = new GetBalanceByUserIdCashFlowQuery(userId, dateRange);
    const result = await handler.execute(query);

    const callArg = cacheServiceMock.getOrSet.mock.calls[0][0];
    expect(callArg.skipWhen?.()).toBe(true);
    expect(result).toEqual(balance);
  });
});
