interface userAuthentica {
  id: string;
  user_name: string;
  user_email: string;
  user_type?: string;
}

export interface AccessDTO {
  user: userAuthentica;
  access_token: string;
  refresh_token?: string;
}
