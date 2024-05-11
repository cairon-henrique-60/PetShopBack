import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  paginationParamSchema,
  stringSchema,
  emailStringSchema,
  dateStringSchema,
  endDateStringSchema,
} from 'src/shared/schemas.shared';

export const paginateUsersSchema = z.object({
  page: paginationParamSchema.optional(),
  limit: paginationParamSchema.optional(),
  user_name: stringSchema.optional(),
  user_email: emailStringSchema.optional(),
  initialDate: dateStringSchema.optional(),
  endDate: endDateStringSchema.optional(),
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
}
