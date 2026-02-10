import { CashFlow } from '@/modules/cash-flows/domain/entities/cash-flow.entity';

export interface CashFlowBalance {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export abstract class CashFlowRepository {
  abstract findById(id: string): Promise<CashFlow | null>;
  abstract findAllByUserId(
    userId: string,
    limit?: number,
    page?: number,
    dateRange?: { from: Date; to: Date },
  ): Promise<CashFlow[]>;
  abstract getBalanceByUserId(
    userId: string,
    dateRange?: { from: Date; to: Date },
  ): Promise<CashFlowBalance>;
  abstract create(cashFlow: CashFlow): Promise<CashFlow>;
  abstract update(id: string, cashFlow: Partial<CashFlow>): Promise<CashFlow>;
  abstract delete(id: string): Promise<void>;
}
