/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { PetBreed } from 'src/modules/pet-breed/entities/pet-breed.entity';
import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';

export default class CatsBreedSeeder implements Seeder {
  track?: boolean | undefined;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const breedRepository = dataSource.getRepository(PetBreed);
    const speciesRepository = dataSource.getRepository(PetSpecies);

    const species = await speciesRepository.findOne({
      where: { species_name: 'Gato' },
    });

    const catBreeds = [
      'Persa',
      'Maine Coon',
      'Siamês',
      'Ragdoll',
      'Bengala',
      'Sphynx',
      'British Shorthair',
      'Scottish Fold',
      'Abissínio',
      'Birmanês',
      'Siberiano',
      'Norueguês da Floresta',
      'Oriental',
      'Devon Rex',
      'Burmese',
      'Manx',
      'Cornish Rex',
      'Chartreux',
      'Tonquinês',
      'American Shorthair',
    ];

    const breedInsertPromises = catBreeds.map(async (breedName) => {
      await breedRepository.insert({
        breed_name: breedName,
        species_id: species?.id,
      });
    });

    await Promise.all(breedInsertPromises);
  }
}
