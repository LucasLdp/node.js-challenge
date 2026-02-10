import { PrismaCashFlowRepository } from '@/modules/cash-flows/infra/database/prisma-cash-flow.repository';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import createPrismaMock from 'prisma-mock/client';
import { CashFlowFactory } from 'test/factories/cash-flow.factory';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('PrismaCashFlowRepository', () => {
  let repository: PrismaCashFlowRepository;
  let prisma: PrismaService;

  beforeAll(() => {
    prisma = createPrismaMock(Prisma);
    repository = new PrismaCashFlowRepository(prisma);
  });

  beforeEach(async () => {
    await prisma.cashFlow.deleteMany({});
  });

  describe('create cash flow', () => {
    it('should create a cash flow in database', async () => {
      const cashFlow = CashFlowFactory.create();

      const result = await repository.create(cashFlow);

      expect(result).not.toBeNull();
      expect(result?.amount).toBe(cashFlow.amount);
      expect(result?.type).toBe(cashFlow.type);
    });
  });

  describe('find cash flow by id', () => {
    it('should return cash flow when found', async () => {
      const cashFlow = CashFlowFactory.create();
      await prisma.cashFlow.create({
        data: {
          id: cashFlow.id!,
          amount: cashFlow.amount,
          type: cashFlow.type,
          userId: cashFlow.userId,
          date: cashFlow.date,
        },
      });

      const result = await repository.findById(cashFlow.id!);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(cashFlow.id);
    });

    it('should return null when cash flow not found', async () => {
      const result = await repository.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('find all cash flows by user id', () => {
    it('should return cash flows when found', async () => {
      const userId = 'shared-user-id';
      const cashFlows = CashFlowFactory.createMany(3, { userId });

      await prisma.cashFlow.createMany({
        data: cashFlows.map((cf) => ({
          id: cf.id!,
          amount: cf.amount,
          type: cf.type,
          userId: cf.userId,
          date: cf.date,
        })),
      });

      const result = await repository.findAllByUserId(userId);

      expect(result).toHaveLength(3);
      expect(result[0].userId).toBe(userId);
    });

    it('should return paginated cash flows', async () => {
      const userId = 'shared-user-id';
      const cashFlows = CashFlowFactory.createMany(5, { userId });

      await prisma.cashFlow.createMany({
        data: cashFlows.map((cf) => ({
          id: cf.id!,
          amount: cf.amount,
          type: cf.type,
          userId: cf.userId,
          date: cf.date,
        })),
      });

      const result = await repository.findAllByUserId(userId, 3, 1);

      expect(result).toHaveLength(3);
    });

    it('should return correct page of cash flows', async () => {
      const userId = 'shared-user-id';
      const cashFlows = CashFlowFactory.createMany(5, { userId });

      await prisma.cashFlow.createMany({
        data: cashFlows.map((cf) => ({
          id: cf.id!,
          amount: cf.amount,
          type: cf.type,
          userId: cf.userId,
          date: cf.date,
        })),
      });

      const result = await repository.findAllByUserId(userId, 3, 2);

      expect(result).toHaveLength(2);
    });

    it('should return empty array when no cash flows found', async () => {
      const result = await repository.findAllByUserId('nonexistent-user-id');

      expect(result).toHaveLength(0);
    });
  });

  describe('update cash flow', () => {
    it('should update cash flow in database', async () => {
      const cashFlow = CashFlowFactory.create();
      await prisma.cashFlow.create({
        data: {
          id: cashFlow.id!,
          amount: cashFlow.amount,
          type: cashFlow.type,
          userId: cashFlow.userId,
          date: cashFlow.date,
        },
      });

      const updatedCashFlow = { ...cashFlow, amount: cashFlow.amount + 100 };
      await repository.update(cashFlow.id!, updatedCashFlow);

      const result = await prisma.cashFlow.findUnique({
        where: { id: cashFlow.id },
      });

      expect(result).not.toBeNull();
      expect(result?.amount).toBe(updatedCashFlow.amount);
    });
  });

  describe('delete cash flow', () => {
    it('should delete cash flow from database', async () => {
      const cashFlow = CashFlowFactory.create();
      await prisma.cashFlow.create({
        data: {
          id: cashFlow.id!,
          amount: cashFlow.amount,
          type: cashFlow.type,
          userId: cashFlow.userId,
          date: cashFlow.date,
        },
      });

      await repository.delete(cashFlow.id!);

      const result = await prisma.cashFlow.findUnique({
        where: { id: cashFlow.id },
      });

      expect(result).toBeNull();
    });
  });
});
