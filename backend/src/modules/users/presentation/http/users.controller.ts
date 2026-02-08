import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
} from '@modules/users/presentation/dto/user.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  UpdateUserCommand,
  DeleteUserCommand,
} from '@modules/users/application/commands/command';

import {
  FindByIdUserQuery,
  ListAllUserQuery,
} from '@/modules/users/application/queries/query';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.commandBus.execute(new CreateUserCommand(createUserDto));
    return { message: 'Usuário criado com sucesso' };
  }

  @Get()
  async findAll() {
    return await this.queryBus.execute(new ListAllUserQuery());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.queryBus.execute(new FindByIdUserQuery(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.commandBus.execute(
      new UpdateUserCommand(id, updateUserDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
