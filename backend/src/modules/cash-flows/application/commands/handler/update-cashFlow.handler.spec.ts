import { UpdateCashFlowCommand } from '@/modules/cash-flows/application/commands/command';
import { UpdateCashFlowHandler } from '@/modules/cash-flows/application/commands/handler/update-cashFlow.handler';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CashFlowFactory } from 'test/factories/cash-flow.factory';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

describe('UpdateCashFlowHandler', () => {
  const cashFlowRepositoryMock = mock<CashFlowRepository>();
  let handler: UpdateCashFlowHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateCashFlowHandler,
        {
          provide: CashFlowRepository,
          useValue: cashFlowRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get<UpdateCashFlowHandler>(UpdateCashFlowHandler);
    mockReset(cashFlowRepositoryMock);
  });

  it("should update a cash flow's description", async () => {
    const cashFlow = CashFlowFactory.create();
    const newDescription = 'Updated description';

    cashFlowRepositoryMock.findById.mockResolvedValueOnce(cashFlow);
    cashFlowRepositoryMock.update.mockResolvedValueOnce(
      CashFlowFactory.create({
        ...cashFlow.props,
        description: newDescription,
      }),
    );

    const command = new UpdateCashFlowCommand(cashFlow.id!, {
      description: newDescription,
    });

    await handler.execute(command);

    expect(cashFlowRepositoryMock.update).toHaveBeenCalledWith(cashFlow.id, {
      description: newDescription,
    });
  });

  it("should update a cash flow's amount", async () => {
    const cashFlow = CashFlowFactory.create();
    const newAmount = 5000;

    cashFlowRepositoryMock.findById.mockResolvedValueOnce(cashFlow);
    cashFlowRepositoryMock.update.mockResolvedValueOnce(
      CashFlowFactory.create({ ...cashFlow.props, amount: newAmount }),
    );

    const command = new UpdateCashFlowCommand(cashFlow.id!, {
      amount: newAmount,
    });

    await handler.execute(command);

    expect(cashFlowRepositoryMock.update).toHaveBeenCalledWith(cashFlow.id, {
      amount: newAmount,
    });
  });

  it("should update a cash flow's date", async () => {
    const cashFlow = CashFlowFactory.create();
    const newDate = new Date('2026-01-15');

    cashFlowRepositoryMock.findById.mockResolvedValueOnce(cashFlow);
    cashFlowRepositoryMock.update.mockResolvedValueOnce(
      CashFlowFactory.create({ ...cashFlow.props, date: newDate }),
    );

    const command = new UpdateCashFlowCommand(cashFlow.id!, {
      date: newDate,
    });

    await handler.execute(command);

    expect(cashFlowRepositoryMock.update).toHaveBeenCalledWith(cashFlow.id, {
      date: newDate,
    });
  });

  it('should throw NotFoundException if cash flow does not exist', async () => {
    cashFlowRepositoryMock.findById.mockResolvedValueOnce(null);

    const command = new UpdateCashFlowCommand('nonexistent-id', {
      amount: 100,
    });

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
