import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from 'src/shared/decorators/auth.decorator';

import { AuthUserDTO } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import { GoogleOauthGuard } from '../guards/google-outh.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: AuthUserDTO) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async registerAndLogin(@Body() registerDTO: AuthUserDTO) {
    return this.authService.signIn(registerDTO);
  }

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Patch('google/login')
  async handleGoogleLogin() {
    return { ok: true };
  }

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Patch('google/redirect')
  async handleGoogleRedirect() {
    return { ok: true };
  }
}
