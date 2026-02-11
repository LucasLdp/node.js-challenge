import { createZodDto } from 'nestjs-zod';

import z from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').describe('Nome do usuário'),
  email: z.email('Invalid email address').describe('Email do usuário'),
  password: z.string().describe('Senha do usuário'),
  role: z.enum(['ADMIN', 'USER']).optional().describe('Papel do usuário'),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
