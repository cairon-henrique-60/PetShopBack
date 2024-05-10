import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { stringSchema, emailStringSchema } from 'src/shared/schemas.shared';

export const createUserSchema = z.object({
  user_name: stringSchema.max(255),
  user_email: emailStringSchema,
  password: stringSchema,
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;

export class CreateUserDTO extends createZodDto(createUserSchema) {
  /**
   * Name of the user.
   * @example Paulo Salvatore
   */
  user_name: string;
  /**
   * Password of the user.
   * @example 909090
   */
  password: string;
  /**
   *Email of the user.
   *@example pauloSalvatore@gmail.com
   */
  user_email: string;
}
