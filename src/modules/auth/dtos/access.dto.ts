interface userAuthentica {
  id: string;
  user_name: string;
  user_email: string;
}

export interface AccessDTO {
  user: userAuthentica;
  access_token: string;
  refresh_token?: string;
}
