import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ENV_VARIABLES } from 'src/config/env.config';
import { validatePassword } from 'src/utils/password.utils';
import { UserTypeEnum } from 'src/modules/user/enum/user-type.enum';
import { UserService } from 'src/modules/user/services/user.service';
import { UnauthorizedError } from 'src/lib/http-exceptions/errors/types/unauthorized-error';

import type { AccessDTO } from '../dtos/access.dto';
import type { RegisterAndLoginPayload } from '../dtos/register-and-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);

    const isMatch = await validatePassword(password, user.hashed_password);

    if (!isMatch) {
      throw new UnauthorizedError('Password is not valid');
    }

    return user;
  }

  async signIn(email: string, pass: string): Promise<AccessDTO> {
    const { id, user_email, user_name, user_type } = await this.validateUser(
      email,
      pass,
    );

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
      },
      access_token,
    };
  }

  async registerAndLogin(data: RegisterAndLoginPayload): Promise<AccessDTO> {
    const { user_email, user_name, id, user_type } =
      await this.usersService.createUser({
        ...data,
        user_type: UserTypeEnum.COMMOM,
      });

    const { access_token } = await this.getAccessToken({
      id,
      email: user_email,
      name: user_name,
      user_type,
    });

    return {
      user: {
        id,
        user_email,
        user_name,
        user_type,
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
