import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { FindByIdUserQuery } from '@/modules/users/application/queries/query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

/**
 * Query Handler to find a user by ID.
 * It retrieves the user from the repository based on the provided ID.
 *
 * @param {FindByIdUserQuery} query - The query containing the ID to search for.
 * @returns {Promise<User>} - A promise that resolves to the user with the specified ID
 */
@QueryHandler(FindByIdUserQuery)
export class FindByIdUserHandler implements IQueryHandler<FindByIdUserQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: FindByIdUserQuery) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
