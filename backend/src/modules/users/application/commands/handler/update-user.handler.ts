import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { UpdateUserCommand } from '@modules/users/application/commands/command';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

/**
 * Update an existing user. Validates if email is already in use by another user and throws ConflictException if so.
 * Validates if the user to update exists and throws NotFoundException if not found.
 * Otherwise, updates the user in the repository with the provided data.
 *
 * @param {UpdateUserCommand} command - The command containing user ID and data to update.
 * @returns {Promise<void>} - A promise that resolves when the user is updated.
 * @throws {ConflictException} - If the email is already in use by another user.
 * @throws {NotFoundException} - If the user to update is not found in the repository.
 *  */
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private userRepository: UserRepository) {}

  async execute({ id, data }: UpdateUserCommand): Promise<void> {
    const { email } = data;

    if (email) {
      const userWithEmail = await this.userRepository.findByEmail(email);

      if (userWithEmail && userWithEmail.id !== id) {
        throw new ConflictException('Email já está em uso.');
      }
    }

    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.userRepository.update(id, data);
  }
}
