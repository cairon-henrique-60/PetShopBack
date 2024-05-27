import { AppDataSource } from 'src/lib/database/database.providers';

import { Pet } from '../entities/pet.entity';

export const petRepository = AppDataSource.getRepository(Pet);
