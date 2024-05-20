import { Module } from '@nestjs/common';

import { calendarProvider } from './providers/calendar.provider';
import { CalendarService } from './services/calendar.service';
import { CalendarController } from './controllers/calendar.controller';

const providers = [...calendarProvider, CalendarService];

@Module({
  providers,
  exports: providers,
  controllers: [CalendarController],
})
export class CalendarModule {}
