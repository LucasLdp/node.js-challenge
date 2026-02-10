import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByEmailQuery } from '@/modules/users/application/queries/query';
import { User } from '@/modules/users/domain/entities/user.entity';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';

/**
 * Query Handler to find a user by email.
 * It retrieves the user from the repository based on the provided email.
 *
 * @param {FindUserByEmailQuery} query - The query containing the email to search for.
 * @returns {Promise<User>} - A promise that resolves to the user with the specified email
 */
@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailHandler implements IQueryHandler<FindUserByEmailQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ email }: FindUserByEmailQuery): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
