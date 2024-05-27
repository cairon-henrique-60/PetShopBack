import { AppDataSource } from 'src/lib/database/database.providers';

import { User } from '../entities/user.entity';

export const userRepository = AppDataSource.getRepository(User);
