import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { VerifyEmailDTO } from '../dto/verifiEmail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail({
    user_email,
    notification,
    code_verification,
  }: VerifyEmailDTO) {
    await this.mailerService.sendMail({
      to: user_email,
      from: 'caironevanessa2017@gmail.com',
      subject: 'Verificação de email',
      text: `${notification}: ${code_verification}`,
      html: '<h1>teste</h1>',
    });
  }
}
