import { User } from '@/modules/users/domain/entities/user.entity';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

/**
 * Factory class for creating User instances for testing purposes.
 *  */
export class UserFactory {
  static create(attrs?: Partial<User>): User {
    return new User({
      id: createId(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...attrs,
    });
  }

  static createMany(count: number, attrs?: Partial<User>): User[] {
    return Array.from({ length: count }, () => this.create(attrs));
  }
}
