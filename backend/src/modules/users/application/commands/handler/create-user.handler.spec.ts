import { CreateUserCommand } from '@/modules/users/application/commands/command';
import { CreateUserHandler } from '@/modules/users/application/commands/handler/create-user.handler';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'vitest-mock-extended';
import { UserFactory } from 'test/factories/user.factory';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CreateUserHandler', () => {
  const userRepositoryMock = mock<UserRepository>();
  let handler: CreateUserHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get<CreateUserHandler>(CreateUserHandler);
    mockReset(userRepositoryMock);
  });

  it('should create a user successfully when email is not in use', async () => {
    const user = UserFactory.create();
    userRepositoryMock.findByEmail.mockResolvedValueOnce(null);

    const command = new CreateUserCommand({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    await handler.execute(command);

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(user.email);
    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: user.name,
        email: user.email,
      }),
    );
  });

  it('should throw ConflictException when email is already in use', async () => {
    const existingUser = UserFactory.create();
    userRepositoryMock.findByEmail.mockResolvedValueOnce(existingUser);

    const command = new CreateUserCommand({
      name: 'New User',
      email: existingUser.email,
      password: '123456',
    });

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });
});
