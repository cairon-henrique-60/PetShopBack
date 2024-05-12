import { DataSource } from 'typeorm';

import { PetSpecies } from '../entities/pet-species.entity';

export const petSpeciesProvider = [
  {
    provide: 'PET_SPECIES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PetSpecies),
    inject: ['DATA_SOURCE'],
  },
];
