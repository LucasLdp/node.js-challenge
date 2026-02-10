import { DeleteUserCommand } from '@/modules/users/application/commands/command';
import { DeleteUserHandler } from '@/modules/users/application/commands/handler/delete-user.handler';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'vitest-mock-extended';
import { describe, it, expect, beforeEach } from 'vitest';

describe('DeleteUserHandler', () => {
  const userRepositoryMock = mock<UserRepository>();
  let handler: DeleteUserHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteUserHandler,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get<DeleteUserHandler>(DeleteUserHandler);
    mockReset(userRepositoryMock);
  });

  it('should delete a user by id', async () => {
    const userId = 'user-123';

    await handler.execute(new DeleteUserCommand(userId));

    expect(userRepositoryMock.delete).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.delete).toHaveBeenCalledTimes(1);
  });
});
