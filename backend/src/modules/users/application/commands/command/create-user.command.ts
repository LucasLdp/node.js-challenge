import { Command } from '@nestjs/cqrs';

export class CreateUserCommand extends Command<void> {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}
