import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from 'src/shared/decorators/auth.decorator';

import { LoginDTO } from '../dtos/login.dto';
import { AccessDTO } from '../dtos/access.dto';
import { RegisterDTO } from '../dtos/register.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: LoginDTO): Promise<AccessDTO> {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async registerAndLogin(@Body() registerDTO: RegisterDTO): Promise<AccessDTO> {
    return this.authService.registerAndLogin(registerDTO);
  }
}
