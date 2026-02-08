import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { CreateUserCommand } from '@modules/users/application/commands/command';
import { User } from '../../../domain/entities/user.entity';
import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateUserCommand)
/**
 * Use case para criar um novo usuário.
 * Verifica se o email já está em uso e, se não estiver, cria um novo usuário com os dados fornecidos.
 *  */
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password }: CreateUserCommand): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email já está em uso.');
    }

    const user = new User({
      name,
      email,
      password,
    });

    await this.userRepository.create(user);
  }
}
