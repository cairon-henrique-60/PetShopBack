import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailController } from './controller/mail.controller';
import { MailService } from './services/mail.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: true,
          auth: {
            user: 'qualquer.com',
            pass: 'quaquer',
          },
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
