/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { PetBreed } from 'src/modules/pet-breed/entities/pet-breed.entity';
import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';

export default class FishisBreedSeeder implements Seeder {
  track?: boolean | undefined;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const breedRepository = dataSource.getRepository(PetBreed);
    const speciesRepository = dataSource.getRepository(PetSpecies);

    const species = await speciesRepository.findOne({
      where: { species_name: 'Peixes' },
    });

    const fishBreeds = [
      'Betta',
      'Guppy',
      'Peixe Palhaço',
      'Neon Tetra',
      'Peixe Oscar',
      'Peixe Anjo',
      'Peixe Dourado',
      'Peixe Disco',
      'Molinésia',
      'Peixe Borboleta',
      'Tetra Negro',
      'Barbo Tigre',
      'Acará Bandeira',
      'Gourami',
      'Platy',
      'Ramirezi',
      'Corydoras',
      'Koi',
      'Danio Zebra',
      'Tetra de Buenos Aires',
    ];

    const breedInsertPromises = fishBreeds.map(async (breedName) => {
      await breedRepository.insert({
        breed_name: breedName,
        species_id: species?.id,
      });
    });

    await Promise.all(breedInsertPromises);
  }
}
