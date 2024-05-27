import { AppDataSource } from 'src/lib/database/database.providers';

import { PetSpecies } from '../entities/pet-species.entity';

export const petSpeciesRepository = AppDataSource.getRepository(PetSpecies);
