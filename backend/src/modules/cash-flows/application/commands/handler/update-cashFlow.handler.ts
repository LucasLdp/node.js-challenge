import { UpdateCashFlowCommand } from '@/modules/cash-flows/application/commands/command';
import { CashFlow } from '@/modules/cash-flows/domain/entities/cash-flow.entity';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateCashFlowCommand)
export class UpdateCashFlowHandler implements ICommandHandler<UpdateCashFlowCommand> {
  constructor(private readonly cashFlowRepository: CashFlowRepository) {}

  async execute({ id, data }: UpdateCashFlowCommand): Promise<CashFlow> {
    const cashFlow = await this.cashFlowRepository.findById(id);

    if (!cashFlow) {
      throw new NotFoundException('Transação não encontrada');
    }

    return await this.cashFlowRepository.update(id, data);
  }
}
