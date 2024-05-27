/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager, runSeeder } from 'typeorm-extension';

import UserSeeder from './UserSeeder';
import SpeciesSeeder from './SpeciesSeeder';
import DogsBreedSeeder from './DogsSeeder';
import CatsBreedSeeder from './CatsSeeder';
import RabbitsBreedSeeder from './RabbitsSeeder';
import HorsesBreedSeeder from './HorsesSeeder';
import HamsterBreedSeeder from './HamstersSeeder';
import GuineaPigBreedSeeder from './GuineaPig';
import BirdsBreedSeeder from './BirdsSeeder';
import FishisBreedSeeder from './FishsSeeder';
import TurtlesBreedSeeder from './TurtleSeeder';
import IguanaBreedSeeder from './IguanaSeeder';
import SnakeBreedSeeder from './SnakeSeeder';
import FerretsBreedSeeder from './FerretSeeder';
import MousesBreedSeeder from './MouseSeeder';
import ChinchilasBreedSeeder from './ChinchilaSeeder';
import PigsBreedSeeder from './PigSeeder';
import PonyBreedSeeder from './PonySeeder';
import GoatBreedSeeder from './GoatSeeder';
import ParrotBreedSeeder from './ParrotSeeder';
import GooseBreedSeeder from './GooseSeeder';
import SheepBreedSeeder from './SheepSeeder';

export class MainSeeder implements Seeder {
  track?: boolean | undefined;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
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
