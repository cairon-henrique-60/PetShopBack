/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager, runSeeder } from 'typeorm-extension';

import {
  BirdsBreedSeeder,
  CatsBreedSeeder,
  ChinchilasBreedSeeder,
  DogsBreedSeeder,
  FerretsBreedSeeder,
  FishisBreedSeeder,
  GoatBreedSeeder,
  GooseBreedSeeder,
  GuineaPigBreedSeeder,
  HamsterBreedSeeder,
  HorsesBreedSeeder,
  IguanaBreedSeeder,
  MousesBreedSeeder,
  ParrotBreedSeeder,
  PigsBreedSeeder,
  PonyBreedSeeder,
  RabbitsBreedSeeder,
  SheepBreedSeeder,
  SnakeBreedSeeder,
  SpeciesSeeder,
  TurtlesBreedSeeder,
  UserSeeder,
} from './seeders';

export class MainSeeder implements Seeder {
  track?: boolean | undefined;
  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await runSeeder(dataSource, UserSeeder);
    await runSeeder(dataSource, SpeciesSeeder);
    await runSeeder(dataSource, DogsBreedSeeder);
    await runSeeder(dataSource, CatsBreedSeeder);
    await runSeeder(dataSource, RabbitsBreedSeeder);
    await runSeeder(dataSource, HorsesBreedSeeder);
    await runSeeder(dataSource, HamsterBreedSeeder);
    await runSeeder(dataSource, GuineaPigBreedSeeder);
    await runSeeder(dataSource, BirdsBreedSeeder);
    await runSeeder(dataSource, FishisBreedSeeder);
    await runSeeder(dataSource, TurtlesBreedSeeder);
    await runSeeder(dataSource, IguanaBreedSeeder);
    await runSeeder(dataSource, SnakeBreedSeeder);
    await runSeeder(dataSource, FerretsBreedSeeder);
    await runSeeder(dataSource, MousesBreedSeeder);
    await runSeeder(dataSource, ChinchilasBreedSeeder);
    await runSeeder(dataSource, PigsBreedSeeder);
    await runSeeder(dataSource, PonyBreedSeeder);
    await runSeeder(dataSource, GoatBreedSeeder);
    await runSeeder(dataSource, ParrotBreedSeeder);
    await runSeeder(dataSource, GooseBreedSeeder);
    await runSeeder(dataSource, SheepBreedSeeder);
  }
}
