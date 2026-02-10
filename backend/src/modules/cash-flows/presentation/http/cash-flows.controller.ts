import {
  CreateCashFlowCommand,
  UpdateCashFlowCommand,
  DeleteCashFlowCommand,
} from '@/modules/cash-flows/application/commands/command';
import {
  FindByIdCashFlowQuery,
  FindAllByUserIdCashFlowQuery,
  GetBalanceByUserIdCashFlowQuery,
} from '@/modules/cash-flows/application/queries/query';
import {
  CreateCashFlowDto,
  UpdateCashFlowDto,
  ResponseCashFlowDto,
} from '@/modules/cash-flows/presentation/dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('cash-flows')
export class CashFlowsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova transação' })
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async create(@Body() createCashFlowDto: CreateCashFlowDto) {
    const command = new CreateCashFlowCommand({
      userId: createCashFlowDto.userId,
      amount: createCashFlowDto.amount,
      type: createCashFlowDto.type,
      description: createCashFlowDto.description,
      date: new Date(createCashFlowDto.date),
    });

    const result = await this.commandBus.execute(command);
    return { message: 'Transação criada com sucesso', data: result };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar transações do usuário' })
  @ApiParam({ name: 'userId', type: 'string', description: 'ID do usuário' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'startDate', required: false, type: 'string' })
  @ApiQuery({ name: 'endDate', required: false, type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Lista de transações',
    type: [ResponseCashFlowDto],
  })
  async findAllByUserId(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange =
      startDate && endDate
        ? { start: new Date(startDate), end: new Date(endDate) }
        : undefined;

    const query = new FindAllByUserIdCashFlowQuery(
      userId,
      limit ? Number(limit) : undefined,
      page ? Number(page) : undefined,
      dateRange,
    );

    return await this.queryBus.execute(query);
  }

  @Get('balance/:userId')
  @ApiOperation({ summary: 'Obter saldo do usuário' })
  @ApiParam({ name: 'userId', type: 'string', description: 'ID do usuário' })
  @ApiQuery({ name: 'startDate', required: false, type: 'string' })
  @ApiQuery({ name: 'endDate', required: false, type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Saldo do usuário',
  })
  async getBalance(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dateRange =
      startDate && endDate
        ? { start: new Date(startDate), end: new Date(endDate) }
        : undefined;

    const query = new GetBalanceByUserIdCashFlowQuery(userId, dateRange);
    return await this.queryBus.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar transação por ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID da transação' })
  @ApiResponse({
    status: 200,
    description: 'Transação encontrada',
    type: ResponseCashFlowDto,
  })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async findOne(@Param('id') id: string) {
    const query = new FindByIdCashFlowQuery(id);
    return await this.queryBus.execute(query);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar transação' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID da transação' })
  @ApiResponse({ status: 200, description: 'Transação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() updateCashFlowDto: UpdateCashFlowDto,
  ) {
    const command = new UpdateCashFlowCommand(id, {
      ...updateCashFlowDto,
      date: updateCashFlowDto.date
        ? new Date(updateCashFlowDto.date)
        : undefined,
    });
    const result = await this.commandBus.execute(command);
    return { message: 'Transação atualizada com sucesso', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar transação' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID da transação' })
  @ApiResponse({ status: 200, description: 'Transação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async remove(@Param('id') id: string) {
    const command = new DeleteCashFlowCommand(id);
    await this.commandBus.execute(command);
    return { message: 'Transação removida com sucesso' };
  }
}
