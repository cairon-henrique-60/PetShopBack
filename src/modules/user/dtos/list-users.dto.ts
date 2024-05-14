import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  optionalEndDateStringSchema,
  optionalDateStringSchema,
  optionalStringSchema,
  optionalEmailStringSchema,
  numberInStringSchema,
} from 'src/shared/schemas.shared';
import { TypesUserEnum } from '../enum';

export const listUsersSchema = z.object({
  user_name: optionalStringSchema,
  user_email: optionalEmailStringSchema,
  initialDate: optionalDateStringSchema,
  endDate: optionalEndDateStringSchema,
  phone_number: numberInStringSchema.optional(),
  type_user: z.nativeEnum(TypesUserEnum).optional(),
});

export type ListUsersPayload = z.infer<typeof listUsersSchema>;

export class ListUsersDTO extends createZodDto(listUsersSchema) {
  /**
   * Name of the user.
   * @example Paulo Salvatore
   */
  @ApiPropertyOptional()
  user_name?: string;
  /**
   *Email of the user.
   *@example pauloSalvatore@gmail.com
   */
  @ApiPropertyOptional()
  user_email?: string;
  /**
   * Initial Date created at of the user.
   * @example 2024-10-10
   */
  @ApiPropertyOptional()
  initialDate?: Date;
  /**
   * End Date created at of the user.
   * @example 2024-11-10
   */
  @ApiPropertyOptional()
  endDate?: Date;
  /**
   *Cell Phone of the user.
   *@example 34991324255
   */
  @ApiPropertyOptional()
  phone_number?: string;
  /**
   *Type of the user.
   *@example ADMIN | COMMOM | COMPANY
   */
  @ApiPropertyOptional()
  type_user?: TypesUserEnum;
}
