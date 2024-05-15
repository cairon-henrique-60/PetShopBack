import { Body, Controller, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from 'src/shared/decorators/auth.decorator';

import { MailService } from '../services/mail.service';
import { VerifiEmailPayload } from '../dto/verifiEmail.dto';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Patch()
  async verifiEmailUser(@Body() verifiEmailDto: VerifiEmailPayload) {
    console.log(verifiEmailDto);
    return this.mailService.sendVerificationEmail(verifiEmailDto);
  }
}
