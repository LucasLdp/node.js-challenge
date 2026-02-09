import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '@modules/users/presentation/dto';
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
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  async create(@Body() data: CreateUserDto) {
    await this.commandBus.execute(new CreateUserCommand(data));
    return { message: 'Usuário criado com sucesso' };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários',
    type: [UserResponseDto],
  })
  async findAll() {
    return await this.queryBus.execute(new ListAllUserQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: UserResponseDto.Output,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Param('id') id: string) {
    return await this.queryBus.execute(new FindByIdUserQuery(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    await this.commandBus.execute(new UpdateUserCommand(id, data));
    return { message: 'Usuário atualizado com sucesso' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar usuário' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async remove(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteUserCommand(id));
    return { message: 'Usuário removido com sucesso' };
  }
}
