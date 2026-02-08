import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { ListAllUserQuery } from '../query/listAll-user.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

/**
 * Use case para listar todos os usuários com paginação. Recebe um limite e uma página, e retorna os usuários correspondentes a essa página.
 */
@QueryHandler(ListAllUserQuery)
export class FindAllUsersUseCase implements IQueryHandler<ListAllUserQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ limit = 10, page = 1 }: ListAllUserQuery) {
    return this.userRepository.findAll(limit, page);
  }
}
