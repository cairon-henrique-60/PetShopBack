import { DataSource } from 'typeorm';

import { PetBreed } from '../entities/pet-breed.entity';

export const petBreedProvider = [
  {
    provide: 'PET_BREED_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PetBreed),
    inject: ['DATA_SOURCE'],
  },
];
