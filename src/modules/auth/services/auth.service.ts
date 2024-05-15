import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ENV_VARIABLES } from 'src/config/env.config';
import { validatePassword } from 'src/utils/password.utils';
import { UserTypeEnum } from 'src/modules/user/enum/user-type.enum';
import { UserService } from 'src/modules/user/services/user.service';
import { UserAuthProviders } from 'src/modules/user/enum/user-auth-providers.enum';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

import type { AuthPayload } from '../dtos/auth.dto';
import type { AccessDTO } from '../dtos/access.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async handleUserSignIn({
    email,
    password,
    provider,
    user_name,
    user_photo_url,
    phone_number,
  }: AuthPayload) {
    const user = await this.usersService.getUserByEmail(email);

    const isGoggleAuth = provider === UserAuthProviders.GOOGLE;

    if (!user) {
      if (!isGoggleAuth && !password)
        throw new BadRequestError('Senha é obrigatória');

      return this.usersService.createUser({
        user_email: email,
        user_name: user_name || '',
        user_type: UserTypeEnum.COMMOM,
        password,
        phone_number,
        user_photo_url,
        is_email_verified: isGoggleAuth,
        user_auth_provider: UserAuthProviders[provider.toUpperCase()],
      });
    }

    if (password && user.hashed_password) {
      const isValidPassword = await validatePassword(
        password,
        user.hashed_password,
      );

      if (!isValidPassword) {
        throw new BadRequestError('Senha incorreta, tente novamente');
      }
    }

    return user;
  }

  async signIn(payload: AuthPayload): Promise<AccessDTO> {
    const {
      id,
      user_email,
      user_name,
      user_type,
      created_at,
      is_email_verified,
      phone_number,
    } = await this.handleUserSignIn(payload);

    const { access_token } = await this.getAccessToken({
      id,
      email: user_email,
      name: user_name,
      user_type,
    });

    return {
      user: {
        id,
        user_name,
        user_email,
        user_type,
        created_at,
        is_email_verified,
        phone_number,
      },
      access_token,
    };
  }

  async getAccessToken({
    email,
    id,
    name,
    user_type,
  }: {
    id: string;
    email: string;
    name: string;
    user_type: string;
  }) {
    const jwtPayload: IJwtPayload = {
      name,
      email,
      id,
      user_type,
    };

    const access_token = await this.jwtService.signAsync(jwtPayload, {
      secret: ENV_VARIABLES.JWT_SECRET,
      expiresIn: ENV_VARIABLES.JWT_EXPIRES_IN,
    });

    return {
      access_token,
    };
  }
}
