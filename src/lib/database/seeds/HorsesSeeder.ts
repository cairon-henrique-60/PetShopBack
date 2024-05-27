/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { PetBreed } from 'src/modules/pet-breed/entities/pet-breed.entity';
import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';

export default class HorsesBreedSeeder implements Seeder {
  track?: boolean | undefined;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const breedRepository = dataSource.getRepository(PetBreed);
    const speciesRepository = dataSource.getRepository(PetSpecies);

    const species = await speciesRepository.findOne({
      where: { species_name: 'Cavalo' },
    });

    const horseBreeds = [
      'Puro-sangue Inglês',
      'Árabe',
      'Quarto de Milha',
      'Andaluz',
      'Frísio',
      'Appaloosa',
      'Percheron',
      'Lipizzaner',
      'Shire',
      'Tennessee Walking Horse',
      'Haflinger',
      'Trakehner',
      'Hanôveriano',
      'Morgan',
      'Mustang',
      'Pinto',
      'Clydesdale',
      'Lusitano',
      'Connemara',
      'Shetland',
    ];

    const breedInsertPromises = horseBreeds.map(async (breedName) => {
      await breedRepository.insert({
        breed_name: breedName,
        species_id: species?.id,
      });
    });

    await Promise.all(breedInsertPromises);
  }
}
