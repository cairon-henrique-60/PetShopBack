import { Module } from '@nestjs/common';

import { UserService } from './services/user.service';
import { userProvider } from './providers/user.provider';
import { UserController } from './controllers/user.controller';

@Module({
  controllers: [UserController],
  providers: [...userProvider, UserService],
  exports: [...userProvider, UserService],
})
export class UserModule {}
