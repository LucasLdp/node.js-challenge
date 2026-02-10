import { Module, Provider } from '@nestjs/common';
import { CashFlowsController } from './presentation/http/cash-flows.controller';
import * as CashFlowCommands from '@modules/cash-flows/application/commands/handler';
import * as CashFlowQueries from '@modules/cash-flows/application/queries/handler';
import { CashFlowRepository } from '@/modules/cash-flows/domain/repositories/cash-flow.repository';
import { PrismaCashFlowRepository } from '@/modules/cash-flows/infra/database/prisma-cash-flow.repository';
import { UsersModule } from '@/modules/users/users.module';

const commandHandlers = Object.values(CashFlowCommands);
const queryHandlers = Object.values(CashFlowQueries);

const CashFlowProvider: Provider[] = [
  {
    provide: CashFlowRepository,
    useClass: PrismaCashFlowRepository,
  },
];

@Module({
  imports: [UsersModule],
  controllers: [CashFlowsController],
  providers: [...commandHandlers, ...queryHandlers, ...CashFlowProvider],
})
export class CashFlowsModule {}
