import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  optionalEmailStringSchema,
  optionalStringSchema,
} from 'src/shared/schemas.shared';

export const updateUserSchema = z.object({
  user_email: optionalEmailStringSchema,
  user_name: optionalStringSchema,
  previous_password: optionalStringSchema,
  new_password: optionalStringSchema,
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;

export class UpdateUserDTO extends createZodDto(updateUserSchema) {
  /**
   * Name of the user.
   * @example Paulo Salvatore
   */
  user_name?: string;
  /**
   *Email of the user.
   *@example pauloSalvatore@gmail.com
   */
  user_email?: string;
  /**
   *Email of the user.
   *@example 909090
   */
  previous_password?: string;
  /**
   *Email of the user.
   *@example 909090
   */
  new_password?: string;
}
