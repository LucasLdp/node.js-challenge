import { FindByIdUserQuery } from '@/modules/users/application/queries/query';
import { FindByIdUserHandler } from '@/modules/users/application/queries/handler/findById-user.handler';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'vitest-mock-extended';
import { UserFactory } from 'test/factories/user.factory';
import { describe, it, expect, beforeEach } from 'vitest';

describe('FindByIdUserHandler', () => {
  const userRepositoryMock = mock<UserRepository>();
  let handler: FindByIdUserHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindByIdUserHandler,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get<FindByIdUserHandler>(FindByIdUserHandler);
    mockReset(userRepositoryMock);
  });

  it('should return user when found', async () => {
    const user = UserFactory.create();
    userRepositoryMock.findById.mockResolvedValueOnce(user);

    const result = await handler.execute(new FindByIdUserQuery(user.id!));

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(user.id);
    expect(result).toEqual(user);
  });

  it('should throw NotFoundException when user is not found', async () => {
    userRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(
      handler.execute(new FindByIdUserQuery('non-existing-id')),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
