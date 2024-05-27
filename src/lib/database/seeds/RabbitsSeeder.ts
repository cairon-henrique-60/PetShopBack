/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { PetBreed } from 'src/modules/pet-breed/entities/pet-breed.entity';
import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';

export default class RabbitsBreedSeeder implements Seeder {
  track?: boolean | undefined;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const breedRepository = dataSource.getRepository(PetBreed);
    const speciesRepository = dataSource.getRepository(PetSpecies);

    const species = await speciesRepository.findOne({
      where: { species_name: 'Coelho' },
    });

    const habbitsBreeds = [
      'Netherland Dwarf',
      'Holland Lop',
      'Mini Rex',
      'Lionhead',
      'Flemish Giant',
      'English Angora',
      'Himalayan',
      'Californian',
      'Dutch',
      'Polish',
      'Harlequin',
      'Silver Marten',
      'Tan',
      'Satin',
      'French Lop',
      'English Lop',
      'American Fuzzy Lop',
      'Belgian Hare',
      'Chinchilla',
      'Havana',
    ];

    const breedInsertPromises = habbitsBreeds.map(async (breedName) => {
      await breedRepository.insert({
        breed_name: breedName,
        species_id: species?.id,
      });
    });

    await Promise.all(breedInsertPromises);
  }
}
