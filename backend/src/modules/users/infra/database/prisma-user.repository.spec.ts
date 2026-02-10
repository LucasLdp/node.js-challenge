import { PrismaUserRepository } from '@/modules/users/infra/database/prisma-user.repository';
import { UserFactory } from 'test/factories/user.factory';
import { Prisma } from '@prisma/client';
import { describe, it, expect, beforeEach } from 'vitest';
import createPrismaMock from 'prisma-mock/client';
import { PrismaService } from 'nestjs-prisma';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = createPrismaMock(Prisma);
    repository = new PrismaUserRepository(prisma);
  });

  describe('create', () => {
    it('should create a user in database', async () => {
      const user = UserFactory.create();

      await repository.create(user);

      const createdUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(createdUser).not.toBeNull();
      expect(createdUser?.name).toBe(user.name);
      expect(createdUser?.email).toBe(user.email);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const user = UserFactory.create();
      await prisma.user.create({
        data: {
          id: user.id!,
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });

      const result = await repository.findByEmail(user.email);

      expect(result).not.toBeNull();
      expect(result?.email).toBe(user.email);
    });

    it('should return null when user not found', async () => {
      const result = await repository.findByEmail('nonexistent@test.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const user = UserFactory.create();
      await prisma.user.create({
        data: {
          id: user.id!,
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });

      const result = await repository.findById(user.id!);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(user.id);
    });

    it('should return null when user not found', async () => {
      const result = await repository.findById('non-existing-id');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const users = UserFactory.createMany(5);
      await prisma.user.createMany({
        data: users.map((user) => ({
          id: user.id!,
          name: user.name,
          email: user.email,
          password: user.password,
        })),
      });

      const result = await repository.findAll(3, 1);

      expect(result).toHaveLength(3);
    });

    it('should return correct page', async () => {
      const users = UserFactory.createMany(5);
      await prisma.user.createMany({
        data: users.map((user) => ({
          id: user.id!,
          name: user.name,
          email: user.email,
          password: user.password,
        })),
      });

      const result = await repository.findAll(3, 2);

      expect(result).toHaveLength(2);
    });

    it('should return empty array when page exceeds total', async () => {
      const users = UserFactory.createMany(3);
      await prisma.user.createMany({
        data: users.map((user) => ({
          id: user.id!,
          name: user.name,
          email: user.email,
          password: user.password,
        })),
      });

      const result = await repository.findAll(10, 2);

      expect(result).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update user data', async () => {
      const user = UserFactory.create();
      await prisma.user.create({
        data: {
          id: user.id!,
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });

      await repository.update(user.id!, { name: 'Updated Name' });

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser?.name).toBe('Updated Name');
    });

    it('should throw error when id is not provided', async () => {
      await expect(repository.update('', { name: 'Test' })).rejects.toThrow(
        'User ID is required for update',
      );
    });
  });

  describe('delete', () => {
    it('should delete user from database', async () => {
      const user = UserFactory.create();
      await prisma.user.create({
        data: {
          id: user.id!,
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });

      await repository.delete(user.id!);

      const deletedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(deletedUser).toBeNull();
    });
  });
});
