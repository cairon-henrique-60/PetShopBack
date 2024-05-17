import {
  Strategy,
  VerifyCallback,
  type Profile,
} from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ENV_VARIABLES } from 'src/config/env.config';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { UserAuthProviders } from 'src/modules/user/enum/user-auth-providers.enum';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: ENV_VARIABLES.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: ENV_VARIABLES.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: ENV_VARIABLES.GOOGLE_OAUTH_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    { emails }: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const user_email = emails?.at(0)?.value;

    if (!user_email) throw new BadRequestError('Email invalido');

    const user = await this.authService.signIn({
      user_email,
      auth_provider: UserAuthProviders.GOOGLE,
    });

    done(null, user);
  }
}
