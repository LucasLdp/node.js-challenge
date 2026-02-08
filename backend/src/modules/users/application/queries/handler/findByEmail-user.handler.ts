import { IQueryHandler } from '@nestjs/cqrs';
import { FindUserByEmailQuery } from '@modules/users/application/queries/query/findByEmail-user.query';
import { User } from '@/modules/users/domain/entities/user.entity';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';

/**
 * Use case para encontrar um usuário por email. Verifica se o usuário existe e, se existir, retorna os dados do usuário. Caso contrário, lança uma exceção de "Usuário não encontrado".
 */
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
