import { DataSource } from 'typeorm';

import { ActivityType } from '../entities/activity-type.entity';

export const activityTypeProvider = [
  {
    provide: 'ACTIVITY_TYPE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ActivityType),
    inject: ['DATA_SOURCE'],
  },
];
