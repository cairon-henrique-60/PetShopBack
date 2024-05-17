import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { userAuthProviderSchema } from 'src/modules/user/dtos/create-user.dto';
import { emailStringSchema, optionalStringSchema } from 'src/shared/schemas.shared';

export const loginSchema = z.object({
  user_email: emailStringSchema,
  password: optionalStringSchema,
  auth_provider: userAuthProviderSchema,
});

export type LoginPayload = z.infer<typeof loginSchema>;

export class LoginDTO extends createZodDto(loginSchema) {}
