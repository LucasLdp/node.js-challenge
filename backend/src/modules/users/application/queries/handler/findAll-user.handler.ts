import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { ListAllUserQuery } from '@/modules/users/application/queries/query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

/**
 * Query Handler to list all users with pagination.
 * It retrieves users from the repository based on the provided limit and page parameters.
 *
 * @param {ListAllUserQuery} query - The query containing pagination parameters (limit and page).
 * @returns {Promise<User[]>} - A promise that resolves to an array of users for the specified page and limit.
 */
@QueryHandler(ListAllUserQuery)
export class FindAllUsersHandler implements IQueryHandler<ListAllUserQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ limit = 10, page = 1 }: ListAllUserQuery) {
    return this.userRepository.findAll(limit, page);
  }
}
