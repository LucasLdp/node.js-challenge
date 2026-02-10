import { GetBalanceByUserIdCashFlowQuery } from '@/modules/cash-flows/application/queries/query';
import { GetBalanceByUserIdCashFlowHandler } from '@/modules/cash-flows/application/queries/handler/getBalanceByUserId-cashFlow.handler';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'vitest-mock-extended';
import { describe, it, expect, beforeEach } from 'vitest';

describe('GetBalanceByUserIdCashFlowHandler', () => {
  const cashFlowRepositoryMock = mock<CashFlowRepository>();
  let handler: GetBalanceByUserIdCashFlowHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetBalanceByUserIdCashFlowHandler,
        {
          provide: CashFlowRepository,
          useValue: cashFlowRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get<GetBalanceByUserIdCashFlowHandler>(
      GetBalanceByUserIdCashFlowHandler,
    );
    mockReset(cashFlowRepositoryMock);
  });

  it('should return balance from repository', async () => {
    const userId = 'user-123';
    const balance = {
      totalIncome: 1500,
      totalExpense: 300,
      balance: 1200,
    };
    cashFlowRepositoryMock.getBalanceByUserId.mockResolvedValueOnce(balance);

    const query = new GetBalanceByUserIdCashFlowQuery(userId);
    const result = await handler.execute(query);

    expect(cashFlowRepositoryMock.getBalanceByUserId).toHaveBeenCalledWith(
      userId,
      undefined,
    );
    expect(result).toEqual(balance);
  });

  it('should pass date range to repository', async () => {
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

    expect(cashFlowRepositoryMock.getBalanceByUserId).toHaveBeenCalledWith(
      userId,
      { from: dateRange.start, to: dateRange.end },
    );
    expect(result).toEqual(balance);
  });

  it('should return zero balance when no transactions', async () => {
    const userId = 'user-123';
    const balance = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    };
    cashFlowRepositoryMock.getBalanceByUserId.mockResolvedValueOnce(balance);

    const query = new GetBalanceByUserIdCashFlowQuery(userId);
    const result = await handler.execute(query);

    expect(result).toEqual(balance);
  });
});
