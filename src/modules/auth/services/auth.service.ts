import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ENV_VARIABLES } from 'src/config/env.config';
import { validatePassword } from 'src/utils/password.utils';
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
    const { id, user_email, user_name } = await this.validateUser(email, pass);

    const { access_token } = await this.getAccessToken(
      id,
      user_email,
      user_name,
    );

    return {
      user: {
        id,
        user_name,
        user_email,
      },
      access_token,
    };
  }

  async registerAndLogin(data: RegisterAndLoginPayload): Promise<AccessDTO> {
    const createdUser = await this.usersService.createUser(data);

    const { access_token } = await this.getAccessToken(
      createdUser.id,
      createdUser.user_email,
      createdUser.user_name,
    );

    return {
      user: {
        id: createdUser.id,
        user_email: createdUser.user_email,
        user_name: createdUser.user_name,
      },
      access_token,
    };
  }

  async getAccessToken(user_id: string, email: string, name: string) {
    const jwtPayload: IJwtPayload = {
      name,
      email: email,
      id: user_id,
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
