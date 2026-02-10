import { CreateCashFlowCommand } from '@/modules/cash-flows/application/commands/command';
import { CashFlow } from '@/modules/cash-flows/domain/entities/cash-flow.entity';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateCashFlowCommand)
export class CreateCashFlowHandler implements ICommandHandler<CreateCashFlowCommand> {
  constructor(
    private readonly cashFlowRepository: CashFlowRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ data }: CreateCashFlowCommand): Promise<CashFlow> {
    const user = await this.userRepository.findById(data.userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const cashFlow = new CashFlow({
      userId: data.userId,
      amount: data.amount,
      type: data.type,
      description: data.description,
      date: data.date,
    });

    return this.cashFlowRepository.create(cashFlow);
  }
}
