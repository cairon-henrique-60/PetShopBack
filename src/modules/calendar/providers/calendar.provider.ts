import { DataSource } from 'typeorm';

import { Calendar } from '../entities/calendar.entity';

export const calendarProvider = [
  {
    provide: 'CALENDAR_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Calendar),
    inject: ['DATA_SOURCE'],
  },
];
