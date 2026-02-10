import { FindUserByEmailQuery } from '@/modules/users/application/queries/query';
import { FindUserByEmailHandler } from '@/modules/users/application/queries/handler/findByEmail-user.handler';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'vitest-mock-extended';
import { UserFactory } from 'test/factories/user.factory';
import { describe, it, expect, beforeEach } from 'vitest';

describe('FindUserByEmailHandler', () => {
  const userRepositoryMock = mock<UserRepository>();
  let handler: FindUserByEmailHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindUserByEmailHandler,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get<FindUserByEmailHandler>(FindUserByEmailHandler);
    mockReset(userRepositoryMock);
  });

  it('should return user when found by email', async () => {
    const user = UserFactory.create();
    userRepositoryMock.findByEmail.mockResolvedValueOnce(user);

    const result = await handler.execute(new FindUserByEmailQuery(user.email));

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(user.email);
    expect(result).toEqual(user);
  });

  it('should throw NotFoundException when user is not found', async () => {
    userRepositoryMock.findByEmail.mockResolvedValueOnce(null);

    await expect(
      handler.execute(new FindUserByEmailQuery('nonexistent@test.com')),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
