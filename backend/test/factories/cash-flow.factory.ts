import { CashFlow } from '@/modules/cash-flows/domain/entities/cash-flow.entity';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

/**
 * Factory class for creating CashFlow instances for testing purposes.
 *  */
export class CashFlowFactory {
  static create(attrs: Partial<CashFlow['props']> = {}): CashFlow {
    return new CashFlow({
      userId: createId(),
      amount: faker.number.float({ min: 1, max: 10000, fractionDigits: 2 }),
      type: faker.helpers.arrayElement(['INCOME', 'EXPENSE']),
      description: faker.commerce.productDescription(),
      date: faker.date.recent(),
      id: createId(),
      ...attrs,
    });
  }

  static createMany(
    count: number,
    attrs: Partial<CashFlow['props']> = {},
  ): CashFlow[] {
    return Array.from({ length: count }, () => this.create(attrs));
  }
}
