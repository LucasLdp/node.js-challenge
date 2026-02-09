import { createZodDto } from 'nestjs-zod';

import z from 'zod';

const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .describe('Nome do usuário')
    .optional(),
  email: z
    .email('Invalid email address')
    .describe('Email do usuário')
    .optional(),
  password: z.string().describe('Senha do usuário').optional(),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
