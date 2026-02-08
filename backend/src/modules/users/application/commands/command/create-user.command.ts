import { Command } from '@nestjs/cqrs';

export class CreateUserCommand extends Command<void> {
  constructor(
    public data: {
      name: string;
      email: string;
      password: string;
    },
  ) {
    super();
  }
}
