import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import {
  optionalNumberInStringSchema,
  optionalEmailStringSchema,
  optionalStringSchema,
} from 'src/shared/schemas.shared';

import { UserTypeEnum } from '../enum/user-type.enum';

export const updateUserSchema = z.object({
  user_email: optionalEmailStringSchema,
  user_name: optionalStringSchema,
  previous_password: optionalStringSchema,
  new_password: optionalStringSchema,
  phone_number: optionalNumberInStringSchema,
  user_type: z.nativeEnum(UserTypeEnum).optional(),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;

export class UpdateUserDTO extends createZodDto(updateUserSchema) {
  @ApiProperty({ example: 'Paulo Salvatore' })
  /**
   * Name of the user.
   * @example Paulo Salvatore
   */
  user_name?: string;
  @ApiProperty({ example: 'pauloSalvatore@gmail.com' })
  /**
   *Email of the user.
   *@example pauloSalvatore@gmail.com
   */
  user_email?: string;
  @ApiProperty({ example: '909090' })
  /**
   *Current password of the user.
   *@example 909090
   */
  previous_password?: string;
  @ApiProperty({ example: '909090' })
  /**
   *New password of the user.
   *@example 909090
   */
  new_password?: string;
  @ApiProperty({ example: '34991324255' })
  /**
   *Cell Phone of the user.
   *@example 34991324255
   */
  phone_number?: string;
  @ApiProperty({ example: 'ADMIN | COMMOM | COMPANY' })
  /**
   *Type of the user.
   *@example ADMIN | COMMOM | COMPANY
   */
  user_type?: UserTypeEnum;
}
