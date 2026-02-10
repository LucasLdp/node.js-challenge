import { CreateCashFlowCommand } from '@/modules/cash-flows/application/commands/command';
import { CreateCashFlowHandler } from '@/modules/cash-flows/application/commands/handler/create-cashFlow.handler';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CashFlowFactory } from 'test/factories/cash-flow.factory';
import { UserFactory } from 'test/factories/user.factory';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

describe('CreateCashFlowHandler', () => {
  const cashFlowRepositoryMock = mock<CashFlowRepository>();
  const userRepositoryMock = mock<UserRepository>();
  let handler: CreateCashFlowHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateCashFlowHandler,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
        {
          provide: CashFlowRepository,
          useValue: cashFlowRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get<CreateCashFlowHandler>(CreateCashFlowHandler);
    mockReset(cashFlowRepositoryMock);
    mockReset(userRepositoryMock);
  });

  it('should create a cash flow successfully', async () => {
    const cashFlow = CashFlowFactory.create();
    const user = UserFactory.create();
    userRepositoryMock.findById.mockResolvedValueOnce(user);

    const command = new CreateCashFlowCommand({
      userId: cashFlow.userId,
      type: cashFlow.type,
      amount: cashFlow.amount,
      description: cashFlow.description,
      date: cashFlow.date,
    });

    await handler.execute(command);

    expect(cashFlowRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: cashFlow.userId,
        type: cashFlow.type,
        amount: cashFlow.amount,
        description: cashFlow.description,
        date: cashFlow.date,
      }),
    );
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const cashFlow = CashFlowFactory.create();

    const command = new CreateCashFlowCommand({
      userId: cashFlow.userId,
      type: cashFlow.type,
      amount: cashFlow.amount,
      description: cashFlow.description,
      date: cashFlow.date,
    });

    userRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
