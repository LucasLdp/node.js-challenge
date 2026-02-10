import { ListAllUserQuery } from '@/modules/users/application/queries/query';
import { FindAllUsersHandler } from '@/modules/users/application/queries/handler/findAll-user.handler';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'vitest-mock-extended';
import { UserFactory } from 'test/factories/user.factory';
import { describe, it, expect, beforeEach } from 'vitest';

describe('FindAllUsersHandler', () => {
  const userRepositoryMock = mock<UserRepository>();
  let handler: FindAllUsersHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindAllUsersHandler,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    handler = module.get<FindAllUsersHandler>(FindAllUsersHandler);
    mockReset(userRepositoryMock);
  });

  it('should return paginated list of users', async () => {
    const users = [
      UserFactory.create(),
      UserFactory.create(),
      UserFactory.create(),
    ];
    userRepositoryMock.findAll.mockResolvedValueOnce(users);

    const result = await handler.execute(new ListAllUserQuery(10, 1));

    expect(userRepositoryMock.findAll).toHaveBeenCalledWith(10, 1);
    expect(result).toEqual(users);
    expect(result).toHaveLength(3);
  });

  it('should use default values when not provided', async () => {
    const users = [UserFactory.create()];
    userRepositoryMock.findAll.mockResolvedValueOnce(users);

    const result = await handler.execute(new ListAllUserQuery());

    expect(userRepositoryMock.findAll).toHaveBeenCalledWith(10, 1);
    expect(result).toEqual(users);
  });

  it('should return empty array when no users exist', async () => {
    userRepositoryMock.findAll.mockResolvedValueOnce([]);

    const result = await handler.execute(new ListAllUserQuery(10, 1));

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});
