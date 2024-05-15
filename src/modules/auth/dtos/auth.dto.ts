import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  emailStringSchema,
  optionalStringSchema,
  optionalUrlStringSchema,
  optionalNumberInStringSchema,
} from 'src/shared/schemas.shared';
import { userAuthProviderSchema } from 'src/modules/user/dtos/create-user.dto';

export const authDtoSchema = z.object({
  email: emailStringSchema,
  user_name: optionalStringSchema,
  password: optionalStringSchema,
  user_photo_url: optionalUrlStringSchema,
  provider: userAuthProviderSchema,
  phone_number: optionalNumberInStringSchema,
});

export type AuthPayload = z.infer<typeof authDtoSchema>;

export class AuthUserDTO extends createZodDto(authDtoSchema) {
  /**
   *Email of the user.
   *@example levis@gmail.com
   */
  email: string;
  /**
   * Password of the user.
   * @example 909090
   */
  password: string;
  /**
   *Name of the user.
   *@example Gugu
   */
  user_name: string;
}
