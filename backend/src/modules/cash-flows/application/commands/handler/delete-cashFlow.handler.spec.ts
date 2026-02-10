import { DeleteCashFlowCommand } from '@/modules/cash-flows/application/commands/command';
import { DeleteCashFlowHandler } from '@/modules/cash-flows/application/commands/handler/delete-cashFlow.handler';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { Test } from '@nestjs/testing';
import { CashFlowFactory } from 'test/factories/cash-flow.factory';
import { beforeEach, it, expect, describe } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

describe('DeleteCashFlowHandler', () => {
  const cashFlowRepositoryMock = mock<CashFlowRepository>();
  let handler: DeleteCashFlowHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteCashFlowHandler,
        {
          provide: CashFlowRepository,
          useValue: cashFlowRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get<DeleteCashFlowHandler>(DeleteCashFlowHandler);
    mockReset(cashFlowRepositoryMock);
  });

  it('should delete a cash flow by id', async () => {
    const cashFlowId = 'cashFlow-123';
    const cashFlow = CashFlowFactory.create({ id: cashFlowId });

    cashFlowRepositoryMock.findById.mockResolvedValue(cashFlow);

    const command = new DeleteCashFlowCommand(cashFlowId);

    await handler.execute(command);

    expect(cashFlowRepositoryMock.findById).toHaveBeenCalledWith(cashFlowId);
    expect(cashFlowRepositoryMock.delete).toHaveBeenCalledWith(cashFlowId);
    expect(cashFlowRepositoryMock.delete).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException if cash flow does not exist', async () => {
    const cashFlowId = 'non-existent-id';

    cashFlowRepositoryMock.findById.mockResolvedValue(null);

    const command = new DeleteCashFlowCommand(cashFlowId);

    await expect(handler.execute(command)).rejects.toThrow(
      'Transação não encontrada',
    );

    expect(cashFlowRepositoryMock.findById).toHaveBeenCalledWith(cashFlowId);
    expect(cashFlowRepositoryMock.delete).not.toHaveBeenCalled();
  });
});
