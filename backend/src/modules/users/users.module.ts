import { Module, Provider } from '@nestjs/common';
import { UsersController } from './presentation/http/users.controller';
import * as UserCommands from '@modules/users/application/commands/handler';
import * as UserQueries from '@modules/users/application/queries/handler';
import { PrismaUserRepository } from './infra/database/prisma-user.repository';
import { UserRepository } from './domain/repositories/user.repository';

const UserCommandHandlers = Object.values(UserCommands);
const UserQueryHandlers = Object.values(UserQueries);

const UserProvider: Provider[] = [
  {
    provide: UserRepository,
    useClass: PrismaUserRepository,
  },
];

@Module({
  controllers: [UsersController],
  providers: [...UserCommandHandlers, ...UserQueryHandlers, ...UserProvider],
  exports: [UserRepository],
})
export class UsersModule {}
