/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { PetBreed } from 'src/modules/pet-breed/entities/pet-breed.entity';
import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';

export default class SnakeBreedSeeder implements Seeder {
  track?: boolean | undefined;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const breedRepository = dataSource.getRepository(PetBreed);
    const speciesRepository = dataSource.getRepository(PetSpecies);

    const species = await speciesRepository.findOne({
      where: { species_name: 'Cobra' },
    });

    const snakeBreeds = [
      'Python Real',
      'Cobra do Milho',
      'Python Reticulada',
      'Jiboia Constritora',
      'Cobra Rei',
      'Cobra Hognose',
      'Python Albina',
      'Cobra Gopher',
      'Cobra da Califórnia',
      'Cobra Verde',
    ];

    const breedInsertPromises = snakeBreeds.map(async (breedName) => {
      await breedRepository.insert({
        breed_name: breedName,
        species_id: species?.id,
      });
    });

    await Promise.all(breedInsertPromises);
  }
}
