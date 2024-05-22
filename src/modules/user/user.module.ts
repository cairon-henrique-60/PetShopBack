import { Module } from '@nestjs/common';

import { UserService } from './services/user.service';
import { userProvider } from './providers/user.provider';
import { UserController } from './controllers/user.controller';

const providers = [...userProvider, UserService]

@Module({
  controllers: [UserController],
  providers,
  exports: providers,
})
export class UserModule {}
