import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { GoogleController } from './controllers/google.controller';
import { GoogleOauthStrategy } from './strategies/google-oauth.strategy';

@Module({
  imports: [AuthModule],
  controllers: [GoogleController],
  providers: [GoogleOauthStrategy],
})
export class GoogleModule {}
