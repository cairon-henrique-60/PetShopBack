import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { emailStringSchema, stringSchema } from 'src/shared/schemas.shared';

export const authDtoSchema = z.object({
  email: emailStringSchema,
  password: stringSchema,
});

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
}
