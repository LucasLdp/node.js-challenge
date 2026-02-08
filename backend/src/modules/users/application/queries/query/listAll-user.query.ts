import { User } from '@/modules/users/domain/entities/user.entity';
import { Query } from '@nestjs/cqrs';

export class ListAllUserQuery extends Query<User[]> {
  constructor(
    public readonly limit?: number,
    public readonly page?: number,
  ) {
    super();
  }
}
