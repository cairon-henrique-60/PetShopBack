import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { type Request } from 'express';

import { IS_PUBLIC_KEY } from 'src/shared/decorators/auth.decorator';
import { DECODED_TOKEN_KEY } from 'src/shared/decorators/decoded-token.decorator';

import { ENV_VARIABLES } from '../../../config/env.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token && !isPublic) {
      throw new UnauthorizedException();
    }

    try {
      if (token) {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: ENV_VARIABLES.JWT_SECRET,
        });

        if (!request[DECODED_TOKEN_KEY]) request[DECODED_TOKEN_KEY] = payload;
      }

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
