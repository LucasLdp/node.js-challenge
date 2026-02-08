import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.email('Invalid email address').optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
});

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
