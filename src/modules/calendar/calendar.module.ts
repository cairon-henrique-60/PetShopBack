import { Module } from '@nestjs/common';

import { PetModule } from '../pet/pet.module';
import { UserModule } from '../user/user.module';
import { calendarProvider } from './providers/calendar.provider';
import { CalendarService } from './services/calendar.service';
import { CalendarController } from './controllers/calendar.controller';

const providers = [...calendarProvider, CalendarService];

@Module({
  providers,
  exports: providers,
  controllers: [CalendarController],
  imports: [PetModule, UserModule]
})
export class CalendarModule {}
