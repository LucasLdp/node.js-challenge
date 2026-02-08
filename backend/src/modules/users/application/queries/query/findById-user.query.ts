import { User } from '@/modules/users/domain/entities/user.entity';
import { Query } from '@nestjs/cqrs';

export class FindByIdUserQuery extends Query<User> {
  constructor(public readonly id: string) {
    super();
  }
}
