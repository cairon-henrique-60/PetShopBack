import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  stringSchema,
  emailStringSchema,
  optionalStringSchema,
  optionalUrlStringSchema,
  optionalPhoneNumberStringSchema,
} from 'src/shared/schemas.shared';

import { UserTypeEnum } from '../enum/user-type.enum';
import { UserAuthProviders } from '../enum/user-auth-providers.enum';

export const userAuthProviderSchema = z
  .nativeEnum(UserAuthProviders)
  .optional()
  .default(UserAuthProviders.EMAIL);

export const createUserSchema = z.object({
  user_name: stringSchema.max(255),
  user_email: emailStringSchema,
  password: optionalStringSchema,
  phone_number: optionalPhoneNumberStringSchema,
  user_type: z.nativeEnum(UserTypeEnum).optional().default(UserTypeEnum.COMMOM),
  user_auth_provider: userAuthProviderSchema,
  user_photo_url: optionalUrlStringSchema,
  is_email_verified: z.boolean().default(false),
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
  password?: string;
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
  user_type: UserTypeEnum;
}
