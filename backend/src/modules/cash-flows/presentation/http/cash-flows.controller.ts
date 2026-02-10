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
import { CurrentUser } from '@/modules/auth/infra/decorators/current-user.decorator';
import { Roles, Role } from '@/modules/auth/infra/decorators/roles.decorator';
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Transações')
@ApiBearerAuth()
@Controller('cash-flows')
export class CashFlowsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Criar nova transação' })
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(
    @CurrentUser('userId') userId: string,
    @Body() createCashFlowDto: CreateCashFlowDto,
  ) {
    const command = new CreateCashFlowCommand({
      userId,
      amount: createCashFlowDto.amount,
      type: createCashFlowDto.type,
      description: createCashFlowDto.description,
      date: new Date(createCashFlowDto.date),
    });

    const result = await this.commandBus.execute(command);
    return { message: 'Transação criada com sucesso', data: result };
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Listar transações do usuário autenticado' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de resultados',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Página',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    format: 'date-time',
    default: new Date().toISOString(),
    description: 'Data inicial',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    format: 'date-time',
    default: new Date().toISOString(),
    description: 'Data final',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de transações',
    type: [ResponseCashFlowDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(
    @CurrentUser('userId') userId: string,
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

  @Get('balance')
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Obter saldo do usuário autenticado' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Data inicial (ISO 8601)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Data final (ISO 8601)',
  })
  @ApiResponse({
    status: 200,
    description: 'Saldo calculado com totalIncome, totalExpense e balance',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getBalance(
    @CurrentUser('userId') userId: string,
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
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar transação por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID da transação' })
  @ApiResponse({
    status: 200,
    description: 'Transação encontrada',
    type: ResponseCashFlowDto,
  })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Param('id') id: string) {
    const query = new FindByIdCashFlowQuery(id);
    return await this.queryBus.execute(query);
  }

  @Put(':id')
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar transação' })
  @ApiParam({ name: 'id', type: String, description: 'ID da transação' })
  @ApiResponse({ status: 200, description: 'Transação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
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
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Deletar transação' })
  @ApiParam({ name: 'id', type: String, description: 'ID da transação' })
  @ApiResponse({ status: 200, description: 'Transação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async remove(@Param('id') id: string) {
    const command = new DeleteCashFlowCommand(id);
    await this.commandBus.execute(command);
    return { message: 'Transação removida com sucesso' };
  }
}
