import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const UserResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
