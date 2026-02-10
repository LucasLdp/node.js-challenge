import { FindByIdCashFlowQuery } from '@/modules/cash-flows/application/queries/query';
import { CashFlow } from '@/modules/cash-flows/domain/entities/cash-flow.entity';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindByIdCashFlowQuery)
export class FindByIdCashFlowHandler implements IQueryHandler<FindByIdCashFlowQuery> {
  constructor(private readonly repository: CashFlowRepository) {}

  async execute({ id }: FindByIdCashFlowQuery): Promise<CashFlow> {
    const cashFlow = await this.repository.findById(id);

    if (!cashFlow) {
      throw new NotFoundException('Transação não encontrada');
    }

    return cashFlow;
  }
}
