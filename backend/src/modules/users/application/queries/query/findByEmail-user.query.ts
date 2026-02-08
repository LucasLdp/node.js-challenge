import { User } from '@/modules/users/domain/entities/user.entity';
import { Query } from '@nestjs/cqrs';

export class FindUserByEmailQuery extends Query<User> {
  constructor(public readonly email: string) {
    super();
  }
}
