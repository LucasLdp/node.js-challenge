import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../command';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: DeleteUserCommand): Promise<void> {
    await this.userRepository.delete(id);
  }
}
