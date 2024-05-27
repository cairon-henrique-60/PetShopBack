/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager, runSeeder } from 'typeorm-extension';

import UserSeeder from './UserSeeder';
import SpeciesSeeder from './SpeciesSeeder';
import DogsBreedSeeder from './DogsSeeder';

export class MainSeeder implements Seeder {
  track?: boolean | undefined;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await runSeeder(dataSource, UserSeeder);
    await runSeeder(dataSource, SpeciesSeeder);
    await runSeeder(dataSource, DogsBreedSeeder);
  }
}
