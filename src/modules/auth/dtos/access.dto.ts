import { ApiProperty } from '@nestjs/swagger';

class UserDTO {
  @ApiProperty({ description: 'The unique identifier of the user' })
  id: string;

  @ApiProperty({ description: 'The username of the user' })
  user_name: string;

  @ApiProperty({ description: 'The email address of the user' })
  user_email: string;

  @ApiProperty({ description: 'The type of the user' })
  user_type: string;

  @ApiProperty({ description: 'Indicates if the email is verified' })
  is_email_verified: boolean;

  @ApiProperty({ description: 'The date and time when the user was created' })
  created_at: string;

  @ApiProperty({ description: 'The phone number of the user', nullable: true })
  phone_number: string | null;
}

export class AccessDTO {
  @ApiProperty({ type: UserDTO, description: 'The user object' })
  user: UserDTO;

  @ApiProperty({ description: 'The access token' })
  access_token: string;
}
