/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { PetBreed } from 'src/modules/pet-breed/entities/pet-breed.entity';
import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';

export default class DogsBreedSeeder implements Seeder {
  track?: boolean | undefined;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const breedRepository = dataSource.getRepository(PetBreed);
    const speciesRepository = dataSource.getRepository(PetSpecies);

    const species = await speciesRepository.findOne({
      where: { species_name: 'Cão' },
    });

    const dogBreeds = [
      'Labrador Retriever',
      'Bulldog Francês',
      'Golden Retriever',
      'Poodle',
      'Beagle',
      'Rottweiler',
      'Dachshund',
      'Boxer',
      'Husky Siberiano',
      'Chihuahua',
      'Shih Tzu',
      'Pastor Alemão',
      'Pug',
      'Yorkshire Terrier',
      'Border Collie',
      'Schnauzer',
      'Cocker Spaniel',
      'Buldogue Inglês',
      'Doberman Pinscher',
      'Akita',
    ];

    const breedInsertPromises = dogBreeds.map(async (breedName) => {
      await breedRepository.insert({
        breed_name: breedName,
        species_id: species?.id,
      });
    });

    await Promise.all(breedInsertPromises);
  }
}
