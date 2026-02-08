import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { FindOneUserQuery } from '@modules/users/application/queries/query/findOne-user.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

/**
 * Use case para encontrar um usuário por ID. Verifica se o usuário existe e, se existir, retorna os dados do usuário. Caso contrário, lança uma exceção de "Usuário não encontrado".
 */
@QueryHandler(FindOneUserQuery)
export class FindOneUserHandler implements IQueryHandler<FindOneUserQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: FindOneUserQuery) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
