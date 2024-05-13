import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { emailStringSchema, stringSchema } from 'src/shared/schemas.shared';

export const registerAndLoginSchema = z.object({
  user_email: emailStringSchema,
  password: stringSchema,
  user_name: stringSchema,
});

export type RegisterAndLoginPayload = z.infer<typeof registerAndLoginSchema>;

export class RegisterAndLoginDTO extends createZodDto(registerAndLoginSchema) {
  /**
   *Email of the user.
   *@example levis@gmail.com
   */
  user_email: string;
  /**
   * Password of the user.
   * @example 909090
   */
  password: string;

  /**
   * User Name.
   * @example Gu
   */
  user_name: string;
}
