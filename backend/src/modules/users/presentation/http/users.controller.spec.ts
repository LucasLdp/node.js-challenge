import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { describe, it, expect, beforeEach } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';
import { UsersController } from '@/modules/users/presentation/http/users.controller';
import { UserFactory } from 'test/factories/user.factory';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let app: INestApplication;
  const commandBusMock = mock<CommandBus>();
  const queryBusMock = mock<QueryBus>();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: CommandBus, useValue: commandBusMock },
        { provide: QueryBus, useValue: queryBusMock },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    mockReset(commandBusMock);
    mockReset(queryBusMock);
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const users = UserFactory.createMany(3);
      queryBusMock.execute.mockResolvedValueOnce(users);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toEqual(users);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const user = UserFactory.create();
      queryBusMock.execute.mockResolvedValueOnce(user);

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200);

      expect(response.body).toEqual(user);
    });

    it('should return 404 when user not found', async () => {
      queryBusMock.execute.mockRejectedValueOnce(
        new NotFoundException('Usuário não encontrado'),
      );

      const response = await request(app.getHttpServer())
        .get('/users/non-existent-id')
        .expect(404);

      expect(response.body).toMatchObject({
        message: 'Usuário não encontrado',
      });
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user and return success message', async () => {
      const user = UserFactory.create();
      commandBusMock.execute.mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .send({ name: 'Test Name' })
        .expect(200);

      expect(response.body).toEqual({
        message: 'Usuário atualizado com sucesso',
      });
    });

    it('should return 404 when user not found', async () => {
      commandBusMock.execute.mockRejectedValueOnce(
        new NotFoundException('Usuário não encontrado'),
      );

      const response = await request(app.getHttpServer())
        .put('/users/12456')
        .send({ name: 'Test Name' })
        .expect(404);

      expect(response.body).toMatchObject({
        message: 'Usuário não encontrado',
      });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user and return success message', async () => {
      const user = UserFactory.create();
      commandBusMock.execute.mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Usuário removido com sucesso',
      });
    });

    it('should return 404 when user not found', async () => {
      commandBusMock.execute.mockRejectedValueOnce(
        new NotFoundException('Usuário não encontrado'),
      );

      const response = await request(app.getHttpServer())
        .delete('/users/non-existent-id')
        .expect(404);

      expect(response.body).toMatchObject({
        message: 'Usuário não encontrado',
      });
    });
  });
});
