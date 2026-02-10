import { DeleteCashFlowCommand } from '@/modules/cash-flows/application/commands/command';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteCashFlowCommand)
export class DeleteCashFlowHandler implements ICommandHandler<DeleteCashFlowCommand> {
  constructor(private readonly cashFlowRepository: CashFlowRepository) {}

  async execute({ id }: DeleteCashFlowCommand): Promise<void> {
    const flow = await this.cashFlowRepository.findById(id);

    if (!flow) {
      throw new NotFoundException('Transação não encontrada');
    }

    await this.cashFlowRepository.delete(id);
  }
}
