import { FindAllByUserIdCashFlowQuery } from '@/modules/cash-flows/application/queries/query';
import { FindAllByUserIdCashFlowHandler } from '@/modules/cash-flows/application/queries/handler/findAllByUserId-cashFlow.handler';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'vitest-mock-extended';
import { CashFlowFactory } from 'test/factories/cash-flow.factory';
import { describe, it, expect, beforeEach } from 'vitest';

describe('FindAllByUserIdCashFlowHandler', () => {
  const cashFlowRepositoryMock = mock<CashFlowRepository>();
  let handler: FindAllByUserIdCashFlowHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindAllByUserIdCashFlowHandler,
        {
          provide: CashFlowRepository,
          useValue: cashFlowRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get<FindAllByUserIdCashFlowHandler>(
      FindAllByUserIdCashFlowHandler,
    );
    mockReset(cashFlowRepositoryMock);
  });

  it('should return paginated list of cash flows for user', async () => {
    const userId = 'user-123';
    const cashFlows = CashFlowFactory.createMany(3, { userId });
    cashFlowRepositoryMock.findAllByUserId.mockResolvedValueOnce(cashFlows);

    const query = new FindAllByUserIdCashFlowQuery(userId, 10, 1);
    const result = await handler.execute(query);

    expect(cashFlowRepositoryMock.findAllByUserId).toHaveBeenCalledWith(
      userId,
      10,
      1,
      undefined,
    );
    expect(result).toEqual(cashFlows);
    expect(result).toHaveLength(3);
  });

  it('should use default values when not provided', async () => {
    const userId = 'user-123';
    const cashFlows = [CashFlowFactory.create({ userId })];
    cashFlowRepositoryMock.findAllByUserId.mockResolvedValueOnce(cashFlows);

    const query = new FindAllByUserIdCashFlowQuery(userId);
    const result = await handler.execute(query);

    expect(cashFlowRepositoryMock.findAllByUserId).toHaveBeenCalledWith(
      userId,
      10,
      1,
      undefined,
    );
    expect(result).toEqual(cashFlows);
  });

  it('should return empty array when no cash flows exist for user', async () => {
    const userId = 'user-123';
    cashFlowRepositoryMock.findAllByUserId.mockResolvedValueOnce([]);

    const query = new FindAllByUserIdCashFlowQuery(userId, 10, 1);
    const result = await handler.execute(query);

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should filter by date range when provided', async () => {
    const userId = 'user-123';
    const dateRange = {
      start: new Date('2026-01-01'),
      end: new Date('2026-01-31'),
    };
    const cashFlows = CashFlowFactory.createMany(2, { userId });
    cashFlowRepositoryMock.findAllByUserId.mockResolvedValueOnce(cashFlows);

    const query = new FindAllByUserIdCashFlowQuery(userId, 10, 1, dateRange);
    const result = await handler.execute(query);

    expect(cashFlowRepositoryMock.findAllByUserId).toHaveBeenCalledWith(
      userId,
      10,
      1,
      { from: dateRange.start, to: dateRange.end },
    );
    expect(result).toEqual(cashFlows);
  });
});
