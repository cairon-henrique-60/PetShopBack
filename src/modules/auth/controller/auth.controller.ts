import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from 'src/shared/decorators/auth.decorator';

import { AuthUserDTO } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import { RegisterAndLoginDTO } from '../dtos/register-and-login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: AuthUserDTO) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async registerAndLogin(@Body() registerDTO: RegisterAndLoginDTO) {
    return this.authService.registerAndLogin(registerDTO);
  }
}
