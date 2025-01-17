import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { UserService } from 'src/modules/user/services/user.service';

import { VerifyEmailDTO } from '../dto/verify-email.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async sendVerificationEmail({
    user_email,
    notification,
    verfication_code,
  }: VerifyEmailDTO) {
    const userToSendVerificationEmail =
      await this.userService.getUserByEmail(user_email);

    await this.mailerService.sendMail({
      to: userToSendVerificationEmail.user_email,
      from: 'cairo@gmail.com',
      subject: 'Verificação de email',
      text: `${notification}: ${verfication_code}`,
      html: '<h1>teste</h1>',
    });
  }
}
