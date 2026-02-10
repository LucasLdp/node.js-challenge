import { CashFlow } from '@/cash-flows/domain/entities/cash-flow.entity';

export abstract class CashFlowRepository {
  abstract findById(id: string): Promise<CashFlow | null>;
  abstract findAllByUserId(
    userId: string,
    limit?: number,
    page?: number,
    dateRange?: { from: Date; to: Date },
  ): Promise<CashFlow[]>;
  abstract create(cashFlow: CashFlow): Promise<CashFlow>;
  abstract update(id: string, cashFlow: Partial<CashFlow>): Promise<CashFlow>;
  abstract delete(id: string): Promise<void>;
}
