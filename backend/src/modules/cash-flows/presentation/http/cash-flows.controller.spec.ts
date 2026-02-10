import { Test } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import request from 'supertest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { mock, mockReset } from 'vitest-mock-extended';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CashFlowsController } from '@/modules/cash-flows/presentation/http/cash-flows.controller';
import { CashFlowFactory } from 'test/factories/cash-flow.factory';
import { App } from 'supertest/types';

const mockUserId = 'authenticated-user-id';

describe('CashFlowsController', () => {
  let app: INestApplication;
  let server: App;
  const commandBusMock = mock<CommandBus>();
  const queryBusMock = mock<QueryBus>();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CashFlowsController],
      providers: [
        { provide: CommandBus, useValue: commandBusMock },
        { provide: QueryBus, useValue: queryBusMock },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use((req: any, _res: any, next: any) => {
      req.user = { userId: mockUserId, email: 'test@email.com', role: 'user' };
      next();
    });
    await app.init();
    server = app.getHttpServer() as App;
    mockReset(commandBusMock);
    mockReset(queryBusMock);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /cash-flows', () => {
    it('should create cash flow using authenticated user id', async () => {
      const createDto = {
        amount: 100.5,
        type: 'INCOME',
        description: 'Salary',
        date: '2026-01-15T00:00:00.000Z',
      };

      commandBusMock.execute.mockResolvedValueOnce(null);

      const response = await request(server)
        .post('/cash-flows')
        .send(createDto)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'Transação criada com sucesso',
      });
      expect(commandBusMock.execute).toHaveBeenCalled();
    });

    it('should return 404 when user not found', async () => {
      const createDto = {
        amount: 100.5,
        type: 'INCOME',
        description: 'Salary',
        date: '2026-01-15T00:00:00.000Z',
      };

      commandBusMock.execute.mockRejectedValueOnce(
        new NotFoundException('Usuário não encontrado'),
      );

      const response = await request(server)
        .post('/cash-flows')
        .send(createDto)
        .expect(404);

      expect(response.body).toMatchObject({
        message: 'Usuário não encontrado',
      });
    });
  });

  describe('GET /cash-flows', () => {
    it('should return all cash flows for authenticated user', async () => {
      const cashFlows = CashFlowFactory.createMany(3, { userId: mockUserId });
      queryBusMock.execute.mockResolvedValueOnce(cashFlows);

      const response = await request(server).get('/cash-flows').expect(200);

      expect(response.body).toHaveLength(3);
    });

    it('should return paginated cash flows', async () => {
      const cashFlows = CashFlowFactory.createMany(2, { userId: mockUserId });
      queryBusMock.execute.mockResolvedValueOnce(cashFlows);

      const response = await request(server)
        .get('/cash-flows?limit=2&page=1')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should filter by date range', async () => {
      const cashFlows = CashFlowFactory.createMany(2, { userId: mockUserId });
      queryBusMock.execute.mockResolvedValueOnce(cashFlows);

      const response = await request(server)
        .get('/cash-flows?startDate=2026-01-01&endDate=2026-01-31')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should return empty array when no cash flows exist', async () => {
      queryBusMock.execute.mockResolvedValueOnce([]);

      const response = await request(server).get('/cash-flows').expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /cash-flows/:id', () => {
    it('should return cash flow by id', async () => {
      const cashFlow = CashFlowFactory.create();
      queryBusMock.execute.mockResolvedValueOnce(cashFlow);

      const response = await request(server)
        .get(`/cash-flows/${cashFlow.id}`)
        .expect(200);

      const body = response.body as { props: { id: string; amount: number } };
      expect(body.props.id).toEqual(cashFlow.id);
      expect(body.props.amount).toEqual(cashFlow.amount);
    });

    it('should return 404 when cash flow not found', async () => {
      queryBusMock.execute.mockRejectedValueOnce(
        new NotFoundException('Transação não encontrada'),
      );

      const response = await request(server)
        .get('/cash-flows/non-existent-id')
        .expect(404);

      expect(response.body).toMatchObject({
        message: 'Transação não encontrada',
      });
    });
  });

  describe('PUT /cash-flows/:id', () => {
    it('should update cash flow and return success message', async () => {
      const cashFlow = CashFlowFactory.create();
      commandBusMock.execute.mockResolvedValueOnce(cashFlow);

      const response = await request(server)
        .put(`/cash-flows/${cashFlow.id}`)
        .send({ amount: 200 })
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Transação atualizada com sucesso',
      });
    });

    it('should return 404 when cash flow not found', async () => {
      commandBusMock.execute.mockRejectedValueOnce(
        new NotFoundException('Transação não encontrada'),
      );

      const response = await request(server)
        .put('/cash-flows/non-existent-id')
        .send({ amount: 200 })
        .expect(404);

      expect(response.body).toMatchObject({
        message: 'Transação não encontrada',
      });
    });
  });

  describe('DELETE /cash-flows/:id', () => {
    it('should delete cash flow and return success message', async () => {
      const cashFlow = CashFlowFactory.create();
      commandBusMock.execute.mockResolvedValueOnce(null);

      const response = await request(server)
        .delete(`/cash-flows/${cashFlow.id}`)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Transação removida com sucesso',
      });
    });

    it('should return 404 when cash flow not found', async () => {
      commandBusMock.execute.mockRejectedValueOnce(
        new NotFoundException('Transação não encontrada'),
      );

      const response = await request(server)
        .delete('/cash-flows/non-existent-id')
        .expect(404);

      expect(response.body).toMatchObject({
        message: 'Transação não encontrada',
      });
    });
  });

  describe('GET /cash-flows/balance', () => {
    it('should return balance for authenticated user', async () => {
      const balance = {
        totalIncome: 1000,
        totalExpense: 300,
        balance: 700,
      };
      queryBusMock.execute.mockResolvedValueOnce(balance);

      const response = await request(server)
        .get('/cash-flows/balance')
        .expect(200);

      expect(response.body).toEqual(balance);
    });

    it('should return balance with date range filter', async () => {
      const balance = {
        totalIncome: 500,
        totalExpense: 200,
        balance: 300,
      };
      queryBusMock.execute.mockResolvedValueOnce(balance);

      const response = await request(server)
        .get('/cash-flows/balance?startDate=2026-01-01&endDate=2026-01-31')
        .expect(200);

      expect(response.body).toEqual(balance);
    });
  });
});
