import { Module } from '@nestjs/common';

import { ActivityService } from './services/activity.service';
import { activityProviders } from './providers/activity.provider';
import { ActivityController } from './controllers/activity.controller';

const providers = [...activityProviders, ActivityService];

@Module({
  providers,
  exports: providers,
  controllers: [ActivityController],
})
export class ActivityModule {}
