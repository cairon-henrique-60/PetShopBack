import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  optionalPaginationParamSchema,
  optionalStringSchema,
  optionalEndDateStringSchema,
  optionalDateStringSchema,
  optionalEmailStringSchema,
  optionalNumberInStringSchema,
} from 'src/shared/schemas.shared';
import { UserTypeEnum } from '../enum/user-type.enum';

export const paginateUsersSchema = z.object({
  page: optionalPaginationParamSchema,
  limit: optionalPaginationParamSchema,
  user_name: optionalStringSchema,
  user_email: optionalEmailStringSchema,
  initialDate: optionalDateStringSchema,
  endDate: optionalEndDateStringSchema,
  phone_number: optionalNumberInStringSchema,
  user_type: z.nativeEnum(UserTypeEnum).optional(),
});

export type PaginateUsersPayload = z.infer<typeof paginateUsersSchema>;

export class PaginateUsersDTO extends createZodDto(paginateUsersSchema) {
  /**
   * Number of the page.
   * @example 1
   */
  page: number;
  /**
   * Limit per page.
   * @example 100
   */
  limit: number;
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
  user_type?: UserTypeEnum;
}
