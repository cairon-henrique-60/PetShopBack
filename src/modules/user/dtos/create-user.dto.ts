import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  stringSchema,
  emailStringSchema,
  numberInStringSchema,
} from 'src/shared/schemas.shared';

import { TypesUserEnum } from '../enum';

export const createUserSchema = z.object({
  user_name: stringSchema.max(255),
  user_email: emailStringSchema,
  password: stringSchema,
  phone_number: numberInStringSchema.optional(),
  type_user: z.nativeEnum(TypesUserEnum).optional(),
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
