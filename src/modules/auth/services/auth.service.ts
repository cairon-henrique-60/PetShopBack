import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ENV_VARIABLES } from 'src/config/env.config';
import { validatePassword } from 'src/utils/password.utils';
import { User } from 'src/modules/user/entities/user.entity';
import { UserTypeEnum } from 'src/modules/user/enum/user-type.enum';
import { UserService } from 'src/modules/user/services/user.service';
import { UserAuthProviders } from 'src/modules/user/enum/user-auth-providers.enum';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

import type { AccessDTO } from '../dtos/access.dto';
import type { LoginPayload } from '../dtos/login.dto';
import type { RegisterPayload } from '../dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn({
    auth_provider,
    password,
    user_email,
  }: LoginPayload): Promise<AccessDTO> {
    const user = await this.usersService.getUserByEmail(user_email);

    if (auth_provider === UserAuthProviders.EMAIL)
      await this.handleEmailSignIn(user, password);

    if (
      auth_provider === UserAuthProviders.GOOGLE &&
      user.user_auth_provider !== UserAuthProviders.GOOGLE
    ) {
      throw new BadRequestError(
        'Seu cadastro foi feito outra forma tente novamente',
      );
    }

    const access_token = await this.generateAccessToken(user);

    return this.buildAccessDTO(user, access_token);
  }

  public async registerAndLogin({
    password,
    phone_number,
    user_email,
    user_name,
    user_auth_provider,
  }: RegisterPayload): Promise<AccessDTO> {
    const is_google_provider = user_auth_provider === UserAuthProviders.GOOGLE;

    const newUser = await this.usersService.createUser({
      is_email_verified: is_google_provider,
      user_auth_provider,
      user_email,
      user_name,
      user_type: UserTypeEnum.COMMOM,
      password,
      phone_number,
    });

    const access_token = await this.generateAccessToken(newUser);

    return this.buildAccessDTO(newUser, access_token);
  }

  private async handleEmailSignIn(
    user: User,
    password?: string,
  ): Promise<void> {
    if (!password) {
      throw new BadRequestError('Senha é obrigatoria');
    } else if (!user.hashed_password) {
      throw new InternalServerErrorException(
        'Voce provavelmente fez o seu cadastro por outro provedor',
      );
    }

    const passwordsMatch = await validatePassword(
      password,
      user.hashed_password,
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Senha incorreta');
    }
  }

  private async generateAccessToken(user: User): Promise<string> {
    const { access_token } = await this.getAccessToken({
      id: user.id,
      email: user.user_email,
      name: user.user_name,
      user_type: user.user_type,
      user_auth_provider: user.user_auth_provider,
    });

    return access_token;
  }

  private buildAccessDTO(user: User, access_token: string): AccessDTO {
    return {
      user: {
        id: user.id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_type: user.user_type,
        created_at: user.created_at,
        is_email_verified: user.is_email_verified,
        phone_number: user.phone_number,
        total_friends_count: user.total_friends_count,
        user_auth_provider: user.user_auth_provider,
      },
      access_token,
    };
  }

  async getAccessToken(jwtPayload: IJwtPayload) {
    const access_token = await this.jwtService.signAsync(jwtPayload, {
      secret: ENV_VARIABLES.JWT_SECRET,
      expiresIn: ENV_VARIABLES.JWT_EXPIRES_IN,
    });

    return {
      access_token,
    };
  }
}
