import { Command } from '@nestjs/cqrs';

export class DeleteCashFlowCommand extends Command<void> {
  constructor(public id: string) {
    super();
  }
}
