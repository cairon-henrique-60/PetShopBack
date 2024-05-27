import { AppDataSource } from 'src/lib/database/database.providers';

import { Calendar } from '../entities/calendar.entity';

export const calendarRepository = AppDataSource.getRepository(Calendar);
