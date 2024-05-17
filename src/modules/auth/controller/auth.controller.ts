import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from 'src/shared/decorators/auth.decorator';

import { LoginDTO } from '../dtos/login.dto';
import { AuthService } from '../services/auth.service';
import { RegisterDTO } from '../dtos/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: LoginDTO) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async registerAndLogin(@Body() registerDTO: RegisterDTO) {
    return this.authService.registerAndLogin(registerDTO);
  }
}
