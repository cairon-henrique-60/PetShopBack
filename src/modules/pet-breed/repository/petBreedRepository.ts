import { AppDataSource } from 'src/lib/database/database.providers';

import { PetBreed } from '../entities/pet-breed.entity';

export const petBreedRepository = AppDataSource.getRepository(PetBreed);
