import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { CreateUserCommand } from '@modules/users/application/commands/command';

import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '@/modules/users/domain/entities/user.entity';

/**
 * Create a new user. Validates if email is already in use and throws ConflictException if so.
 * Otherwise, creates the user in the repository.
 *
 * @param {CreateUserCommand} command - The command containing user data to create.
 * @returns {Promise<void>} - A promise that resolves when the user is created.
 * @throws {ConflictException} - If the email is already in use by another user.
 *  */
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private userRepository: UserRepository) {}

  async execute({ data }: CreateUserCommand): Promise<void> {
    const { name, email, password, role } = data;
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email já está em uso.');
    }

    const user = new User({
      name,
      email,
      password,
      role,
    });

    await this.userRepository.create(user);
  }
}
