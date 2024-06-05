import { ApiProperty } from '@nestjs/swagger';

import { UserTypeEnum } from 'src/modules/user/enum/user-type.enum';
import { UserAuthProviders } from 'src/modules/user/enum/user-auth-providers.enum';

class UserDTO {
  @ApiProperty({ description: 'The unique identifier of the user' })
  id: string;

  @ApiProperty({ description: 'The username of the user' })
  user_name: string;

  @ApiProperty({ description: 'The email address of the user' })
  user_email: string;

  @ApiProperty({ description: 'The type of the user', enum: UserTypeEnum })
  user_type: UserTypeEnum;

  @ApiProperty({ description: 'Indicates if the email is verified' })
  is_email_verified: boolean;

  @ApiProperty({ description: 'The date and time when the user was created' })
  created_at: string;

  @ApiProperty({ description: 'The phone number of the user', nullable: true })
  phone_number: NullableValue<string>;

  @ApiProperty({
    description: 'The phone number of the user',
    enum: UserAuthProviders,
  })
  user_auth_provider: UserAuthProviders;

  @ApiProperty({
    description: 'Total Friends count',
    default: 0,
  })
  total_friends_count: number;
}

export class AccessDTO {
  @ApiProperty({ type: UserDTO, description: 'The user object' })
  user: UserDTO;

  @ApiProperty({ description: 'The access token' })
  access_token: string;
}
