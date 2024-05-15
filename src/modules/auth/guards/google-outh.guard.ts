import { Injectable, type ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { type Request } from 'express';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    const isAbleToActivate = Boolean(await super.canActivate(context));

    await super.logIn(context.switchToHttp().getRequest<Request>());

    return isAbleToActivate;
  }
}
