import {
  Strategy,
  VerifyCallback,
  type Profile,
} from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ENV_VARIABLES } from 'src/config/env.config';
import { UserAuthProviders } from 'src/modules/user/enum/user-auth-providers.enum';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

import { AuthService } from '../services/auth.service';

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
    { name, emails, photos }: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const user_email = emails?.at(0)?.value;

    if (!user_email) throw new BadRequestError('Email invalido');

    const user_name = `${name?.givenName} ${name?.familyName}`;
    const user_photo_url = photos?.at(0)?.value;

    const user = await this.authService.signIn({
      email: user_email,
      user_name,
      user_photo_url,
      provider: UserAuthProviders.GOOGLE,
    });

    done(null, user);
  }
}
