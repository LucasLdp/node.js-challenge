import { CashFlow } from '@/modules/cash-flows/domain/entities/cash-flow.entity';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PrismaCashFlowRepository implements CashFlowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CashFlow | null> {
    const cashFlow = await this.prisma.cashFlow.findUnique({
      where: { id },
    });

    if (!cashFlow) return null;

    return new CashFlow({
      id: cashFlow.id,
      userId: cashFlow.userId,
      amount: cashFlow.amount,
      description: cashFlow.description,
      type: cashFlow.type,
      date: cashFlow.date,
    });
  }

  async findAllByUserId(
    userId: string,
    limit?: number,
    page?: number,
    dateRange?: { from: Date; to: Date },
  ): Promise<CashFlow[]> {
    const cashFlows = await this.prisma.cashFlow.findMany({
      where: {
        userId,
        date: dateRange
          ? {
              gte: dateRange.from,
              lte: dateRange.to,
            }
          : undefined,
      },
      take: limit,
      skip: page && limit ? (page - 1) * limit : undefined,
    });

    return cashFlows.map(
      (cashFlow) =>
        new CashFlow({
          id: cashFlow.id,
          userId: cashFlow.userId,
          amount: cashFlow.amount,
          description: cashFlow.description,
          type: cashFlow.type,
          date: cashFlow.date,
        }),
    );
  }

  async create(cashFlow: CashFlow): Promise<CashFlow> {
    const createdCashFlow = await this.prisma.cashFlow.create({
      data: {
        userId: cashFlow.userId,
        amount: cashFlow.amount,
        description: cashFlow.description,
        type: cashFlow.type,
        date: cashFlow.date,
      },
    });

    return new CashFlow({
      id: createdCashFlow.id,
      userId: createdCashFlow.userId,
      amount: createdCashFlow.amount,
      description: createdCashFlow.description,
      type: createdCashFlow.type,
      date: createdCashFlow.date,
    });
  }

  async update(id: string, cashFlow: Partial<CashFlow>): Promise<CashFlow> {
    const updatedCashFlow = await this.prisma.cashFlow.update({
      where: { id },
      data: {
        amount: cashFlow.amount,
        description: cashFlow.description,
        type: cashFlow.type,
        date: cashFlow.date,
      },
    });

    return new CashFlow({
      id: updatedCashFlow.id,
      userId: updatedCashFlow.userId,
      amount: updatedCashFlow.amount,
      description: updatedCashFlow.description,
      type: updatedCashFlow.type,
      date: updatedCashFlow.date,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cashFlow.delete({
      where: { id },
    });
  }
}
