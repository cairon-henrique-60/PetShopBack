import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  emailStringSchema,
  optionalStringSchema,
  optionalUrlStringSchema,
  stringSchema,
} from 'src/shared/schemas.shared';
import { userAuthProviderSchema } from 'src/modules/user/dtos/create-user.dto';

export const registerSchema = z.object({
  user_email: emailStringSchema,
  password: optionalStringSchema,
  user_name: stringSchema,
  phone_number: stringSchema,
  user_auth_provider: userAuthProviderSchema,
  user_photo_url: optionalUrlStringSchema,
});

export type RegisterPayload = z.infer<typeof registerSchema>;

export class RegisterDTO extends createZodDto(registerSchema) {}
