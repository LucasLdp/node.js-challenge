import { Command } from '@nestjs/cqrs';

export class UpdateUserCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly data: {
      name?: string;
      email?: string;
      password?: string;
    },
  ) {
    super();
  }
}
