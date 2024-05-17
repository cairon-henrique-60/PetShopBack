import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  emailStringSchema,
  optionalPhoneNumberStringSchema,
  optionalStringSchema,
  optionalUrlStringSchema,
  stringSchema,
} from 'src/shared/schemas.shared';
import { userAuthProviderSchema } from 'src/modules/user/dtos/create-user.dto';
import { UserAuthProviders } from 'src/modules/user/enum/user-auth-providers.enum';

export const registerSchema = z
  .object({
    user_email: emailStringSchema,
    password: optionalStringSchema,
    user_name: stringSchema,
    phone_number: optionalPhoneNumberStringSchema,
    user_auth_provider: userAuthProviderSchema,
    user_photo_url: optionalUrlStringSchema,
  })
  .refine(
    (data) =>
      data.user_auth_provider === UserAuthProviders.EMAIL && !data.password
        ? false
        : true,
    { message: 'Senha é obrigatoria' },
  );

export type RegisterPayload = z.infer<typeof registerSchema>;

export class RegisterDTO extends createZodDto(registerSchema) {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  user_email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password?: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  user_name: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+551112345678',
  })
  phone_number: string;

  @ApiPropertyOptional({
    description: 'The photo URL of the user',
    example: 'https://example.com/photo.jpg',
  })
  user_photo_url?: string;
}
