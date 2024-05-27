import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';

export default class SpeciesSeeder implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const speciesRepository = dataSource.getRepository(PetSpecies);

    await speciesRepository.insert([
      { species_name: 'Cão' },
      { species_name: 'Gato' },
      { species_name: 'Cavalo' },
      { species_name: 'Coelho' },
      { species_name: 'Porquinho-da-Índia' },
      { species_name: 'Hamster' },
      { species_name: 'Pássaros' },
      { species_name: 'Peixes' },
      { species_name: 'Tartaruga' },
      { species_name: 'Iguana' },
      { species_name: 'Cobra' },
      { species_name: 'Furão' },
      { species_name: 'Rato' },
      { species_name: 'Chinchila' },
      { species_name: 'Porco' },
      { species_name: 'Pônei' },
      { species_name: 'Cabra' },
      { species_name: 'Ovelha' },
      { species_name: 'Papagaio' },
      { species_name: 'Ganso' },
    ]);
    // ---------------------------------------------------
    await factoryManager.get(PetSpecies).save();
  }
}
