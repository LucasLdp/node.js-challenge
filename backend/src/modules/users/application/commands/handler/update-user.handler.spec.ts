import { UpdateUserCommand } from '@/modules/users/application/commands/command';
import { UpdateUserHandler } from '@/modules/users/application/commands/handler/update-user.handler';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'vitest-mock-extended';
import { UserFactory } from 'test/factories/user.factory';
import { describe, it, expect, beforeEach } from 'vitest';

describe('UpdateUserHandler', () => {
  const userRepositoryMock = mock<UserRepository>();
  let handler: UpdateUserHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateUserHandler,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get<UpdateUserHandler>(UpdateUserHandler);
    mockReset(userRepositoryMock);
  });

  it('should update a user successfully', async () => {
    const existingUser = UserFactory.create();
    userRepositoryMock.findByEmail.mockResolvedValueOnce(null);
    userRepositoryMock.findById.mockResolvedValueOnce(existingUser);

    const command = new UpdateUserCommand(existingUser.id!, {
      name: 'Updated Name',
    });

    await handler.execute(command);

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(existingUser.id);
    expect(userRepositoryMock.update).toHaveBeenCalledWith(existingUser.id, {
      name: 'Updated Name',
    });
  });

  it('should update user email when new email is not in use', async () => {
    const existingUser = UserFactory.create();
    userRepositoryMock.findByEmail.mockResolvedValueOnce(null);
    userRepositoryMock.findById.mockResolvedValueOnce(existingUser);

    const command = new UpdateUserCommand(existingUser.id!, {
      email: 'newemail@test.com',
    });

    await handler.execute(command);

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      'newemail@test.com',
    );
    expect(userRepositoryMock.update).toHaveBeenCalledWith(existingUser.id, {
      email: 'newemail@test.com',
    });
  });

  it('should allow user to keep their own email', async () => {
    const existingUser = UserFactory.create();
    userRepositoryMock.findByEmail.mockResolvedValueOnce(existingUser);
    userRepositoryMock.findById.mockResolvedValueOnce(existingUser);

    const command = new UpdateUserCommand(existingUser.id!, {
      email: existingUser.email,
    });

    await handler.execute(command);

    expect(userRepositoryMock.update).toHaveBeenCalledWith(existingUser.id, {
      email: existingUser.email,
    });
  });

  it('should throw ConflictException when email is already in use by another user', async () => {
    const existingUser = UserFactory.create();
    const anotherUser = UserFactory.create();
    userRepositoryMock.findByEmail.mockResolvedValueOnce(anotherUser);

    const command = new UpdateUserCommand(existingUser.id!, {
      email: anotherUser.email,
    });

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when user does not exist', async () => {
    userRepositoryMock.findByEmail.mockResolvedValueOnce(null);
    userRepositoryMock.findById.mockResolvedValueOnce(null);

    const command = new UpdateUserCommand('non-existing-id', {
      name: 'Updated Name',
    });

    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });
});
