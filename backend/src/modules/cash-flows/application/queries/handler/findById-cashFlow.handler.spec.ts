import { FindByIdCashFlowQuery } from '@/modules/cash-flows/application/queries/query';
import { FindByIdCashFlowHandler } from '@/modules/cash-flows/application/queries/handler/findById-cashFlow.handler';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'vitest-mock-extended';
import { CashFlowFactory } from 'test/factories/cash-flow.factory';
import { describe, it, expect, beforeEach } from 'vitest';

describe('FindByIdCashFlowHandler', () => {
  const cashFlowRepositoryMock = mock<CashFlowRepository>();
  let handler: FindByIdCashFlowHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindByIdCashFlowHandler,
        {
          provide: CashFlowRepository,
          useValue: cashFlowRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get<FindByIdCashFlowHandler>(FindByIdCashFlowHandler);
    mockReset(cashFlowRepositoryMock);
  });

  it('should return cash flow when found', async () => {
    const cashFlow = CashFlowFactory.create();
    cashFlowRepositoryMock.findById.mockResolvedValueOnce(cashFlow);

    const query = new FindByIdCashFlowQuery(cashFlow.id!);
    const result = await handler.execute(query);

    expect(cashFlowRepositoryMock.findById).toHaveBeenCalledWith(cashFlow.id);
    expect(result).toEqual(cashFlow);
  });

  it('should throw NotFoundException when cash flow is not found', async () => {
    cashFlowRepositoryMock.findById.mockResolvedValueOnce(null);

    const query = new FindByIdCashFlowQuery('non-existing-id');

    await expect(handler.execute(query)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
