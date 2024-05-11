import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  stringSchema,
  emailStringSchema,
  dateStringSchema,
  endDateStringSchema,
} from 'src/shared/schemas.shared';

export const listUsersSchema = z.object({
  user_name: stringSchema.optional(),
  user_email: emailStringSchema.optional(),
  initialDate: dateStringSchema.optional(),
  endDate: endDateStringSchema.optional(),
});

export type ListUsersPayload = z.infer<typeof listUsersSchema>;

export class ListUsersDTO extends createZodDto(listUsersSchema) {
  /**
   * Name of the user.
   * @example Paulo Salvatore
   */
  @ApiPropertyOptional()
  user_name: string;
  /**
   *Email of the user.
   *@example pauloSalvatore@gmail.com
   */
  @ApiPropertyOptional()
  user_email: string;
  /**
   * Initial Date created at of the user.
   * @example 2024-10-10
   */
  @ApiPropertyOptional()
  initialDate: Date;
  /**
   * End Date created at of the user.
   * @example 2024-11-10
   */
  @ApiPropertyOptional()
  endDate: Date;
}
