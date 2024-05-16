import { Module } from '@nestjs/common';

import { ActivityTypeService } from './services/activity-type.service';
import { activityTypeProvider } from './providers/activity-type.provider';
import { ActivityTypeController } from './controllers/activity-type.controller';

const providers = [...activityTypeProvider, ActivityTypeService];

@Module({
  providers,
  exports: providers,
  controllers: [ActivityTypeController],
})
export class ActivityTypeModule {}
