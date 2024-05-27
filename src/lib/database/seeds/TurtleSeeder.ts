/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { PetBreed } from 'src/modules/pet-breed/entities/pet-breed.entity';
import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';

export default class TurtlesBreedSeeder implements Seeder {
  track?: boolean | undefined;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const breedRepository = dataSource.getRepository(PetBreed);
    const speciesRepository = dataSource.getRepository(PetSpecies);

    const species = await speciesRepository.findOne({
      where: { species_name: 'Tartaruga' },
    });

    const turtleBreeds = [
      'Tartaruga de Orelha Vermelha',
      'Tartaruga Russa',
      'Tartaruga Leopard',
      'Tartaruga de Caixa',
      'Tartaruga de Casco Mole',
      'Tartaruga Marginata',
      'Tartaruga de Estrela Indiana',
      'Tartaruga de Esporas Africanas',
      'Tartaruga de Pântano',
      'Tartaruga de Madeira',
    ];

    const breedInsertPromises = turtleBreeds.map(async (breedName) => {
      await breedRepository.insert({
        breed_name: breedName,
        species_id: species?.id,
      });
    });

    await Promise.all(breedInsertPromises);
  }
}
