interface IUser {
  id: string;
  user_name: string;
  user_email: string;
  user_type: string;
  is_email_verified: boolean;
  created_at: string;
  phone_number: string;
}

export interface AccessDTO {
  user: IUser;
  access_token: string;
}
