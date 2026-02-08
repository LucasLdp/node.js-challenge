import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { UpdateUserCommand } from '@modules/users/application/commands/command';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

/**
 * Use case para atualizar um usuário existente.
 * Verifica se o email fornecido já está em uso por outro usuário e se o usuário a ser atualizado existe.
 * Se as validações passarem, atualiza os dados do usuário com as informações fornecidas.
 *  */
@CommandHandler(UpdateUserCommand)
export class UpdateUserUseCase implements ICommandHandler<UpdateUserCommand> {
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
