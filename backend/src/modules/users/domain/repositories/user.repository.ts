import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract findAll(limit: number, page?: number): Promise<User[]>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
  abstract update(id: string, user: Partial<User>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
