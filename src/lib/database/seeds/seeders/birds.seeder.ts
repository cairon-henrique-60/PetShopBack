/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { PetBreed } from 'src/modules/pet-breed/entities/pet-breed.entity';
import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';

export default class BirdsBreedSeeder implements Seeder {
  track?: boolean | undefined;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const breedRepository = dataSource.getRepository(PetBreed);
    const speciesRepository = dataSource.getRepository(PetSpecies);

    const species = await speciesRepository.findOne({
      where: { species_name: 'Pássaros' },
    });

    const birdBreeds = [
      'Periquito',
      'Canário',
      'Calopsita',
      'Papagaio',
      'Agapornis',
      'Cacatua',
      'Arara',
      'Mandarim',
      'Diamante Gould',
      'Mainá',
      'Coruja',
      'Falco',
      'Pomba',
      'Cardeal',
      'Rouxinol',
      'Pintassilgo',
      'Rosela',
      'Galah',
      'Rosella',
      'Manon',
    ];

    const breedInsertPromises = birdBreeds.map(async (breedName) => {
      await breedRepository.insert({
        breed_name: breedName,
        species_id: species?.id,
      });
    });

    await Promise.all(breedInsertPromises);
  }
}
