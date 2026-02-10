import { AuthController } from '@/modules/auth/presentation/http/auth.controller';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { Test } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { mock, mockReset } from 'vitest-mock-extended';
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { App } from 'supertest/types';
import { ZodValidationPipe } from 'nestjs-zod';

describe('AuthController', () => {
  const authServiceMock = mock<AuthService>();
  let app: NestExpressApplication;
  let server: App;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();
    server = app.getHttpServer() as App;
    mockReset(authServiceMock);
  });

  describe('POST /auth/register', () => {
    it('should register user and return token', async () => {
      const registerResult = {
        accessToken: 'jwt-token',
        user: { id: 'user-id', name: 'John Doe', email: 'john@email.com' },
      };
      authServiceMock.register.mockResolvedValueOnce(registerResult);

      const response = await request(server)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@email.com',
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'Usuário registrado com sucesso',
        accessToken: 'jwt-token',
        user: { id: 'user-id', name: 'John Doe', email: 'john@email.com' },
      });
      expect(authServiceMock.register).toHaveBeenCalledWith(
        'John Doe',
        'john@email.com',
        'password123',
      );
    });

    it('should return 409 when email already exists', async () => {
      authServiceMock.register.mockRejectedValueOnce(
        new ConflictException('Email já cadastrado'),
      );

      const response = await request(server)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'existing@email.com',
          password: 'password123',
        })
        .expect(409);

      expect(response.body).toMatchObject({
        message: 'Email já cadastrado',
      });
    });

    it('should return 400 for invalid email', async () => {
      await request(server)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });

    it('should return 400 for short password', async () => {
      await request(server)
        .post('/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@email.com',
          password: '123',
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login user and return token', async () => {
      const loginResult = {
        accessToken: 'jwt-token',
        user: { id: 'user-id', name: 'John Doe', email: 'john@email.com' },
      };
      authServiceMock.signIn.mockResolvedValueOnce(loginResult);

      const response = await request(server)
        .post('/auth/login')
        .send({
          email: 'john@email.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Login realizado com sucesso',
        accessToken: 'jwt-token',
        user: { id: 'user-id', name: 'John Doe', email: 'john@email.com' },
      });
      expect(authServiceMock.signIn).toHaveBeenCalledWith(
        'john@email.com',
        'password123',
      );
    });

    it('should return 401 for invalid credentials', async () => {
      authServiceMock.signIn.mockRejectedValueOnce(
        new UnauthorizedException('Credenciais inválidas'),
      );

      const response = await request(server)
        .post('/auth/login')
        .send({
          email: 'john@email.com',
          password: 'wrong-password',
        })
        .expect(401);

      expect(response.body).toMatchObject({
        message: 'Credenciais inválidas',
      });
    });

    it('should return 400 for invalid email format', async () => {
      await request(server)
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });
  });
});
