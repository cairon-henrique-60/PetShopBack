import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  numberInStringSchema,
  optionalEmailStringSchema,
  optionalStringSchema,
} from 'src/shared/schemas.shared';

import { TypesUserEnum } from '../enum';

export const updateUserSchema = z.object({
  user_email: optionalEmailStringSchema,
  user_name: optionalStringSchema,
  previous_password: optionalStringSchema,
  new_password: optionalStringSchema,
  phone_number: numberInStringSchema,
  type_user: z.nativeEnum(TypesUserEnum).optional(),
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
   *Current password of the user.
   *@example 909090
   */
  previous_password?: string;
  /**
   *New password of the user.
   *@example 909090
   */
  new_password?: string;
   /**
   *Cell Phone of the user.
   *@example 34991324255
   */
   phone_number?: string;
   /**
    *Type of the user.
    *@example ADMIN | COMMOM | COMPANY
    */
   type_user?: TypesUserEnum;
}
