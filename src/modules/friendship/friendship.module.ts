import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { FriendshipService } from './services/friendship.service';
import { FriendshipController } from './controllers/friendship.controller';

@Module({
  controllers: [FriendshipController],
  imports: [UserModule],
  exports: [FriendshipService],
  providers: [FriendshipService],
})
export class FriendshipModule {}
