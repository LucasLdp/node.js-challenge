import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { User } from '@modules/users/domain/entities/user.entity';

/**
 * Repositório de usuários usando Prisma.
 * Implementa a interface UserRepository para fornecer métodos de acesso aos dados dos usuários no banco de dados.
 * Utiliza o PrismaService para realizar operações de leitura e escrita no banco de dados.
 */
@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit: number, page: number = 1): Promise<User[]> {
    const skip = (page - 1) * limit;
    const users = await this.prisma.user.findMany({
      take: limit,
      skip: skip,
    });

    return users.map(
      (user) =>
        new User({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        }),
    );
  }

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    });
  }

  async update(id: string, user: Partial<User>): Promise<void> {
    if (!id) {
      throw new Error('User ID is required for update');
    }

    await this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
