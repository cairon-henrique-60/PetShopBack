import { Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from 'src/shared/decorators/auth.decorator';

import { GoogleOauthGuard } from '../guards/google-outh.guard';

@ApiTags('google')
@Controller('google')
export class GoogleController {
  @Public()
  @UseGuards(GoogleOauthGuard)
  @Patch('login')
  async handleGoogleLogin() {
    return { ok: true };
  }

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Patch('register')
  async handleGoogleRegister() {
    return { ok: true };
  }

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Patch('redirect')
  async handleGoogleRedirect() {
    return { ok: true };
  }
}
