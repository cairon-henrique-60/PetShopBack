import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

import { ENV_VARIABLES } from 'src/config/env.config';
import { SeederOptions } from 'typeorm-extension';

import { MainSeeder } from './seeds/MainSeeder';

const entitiesPath = path.resolve(__dirname, '../../**/*.entity{.ts,.js}');
const migrationsPath = path.resolve(
  __dirname,
  '../../lib/database/migrations/{*.ts,*.js}',
);

const hasDatabaseHost = ENV_VARIABLES.DATABASE_HOST === 'localhost';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  port: ENV_VARIABLES.DB_PORT,
  username: ENV_VARIABLES.DB_USER,
  password: ENV_VARIABLES.DATABASE_ROOT_PASSWORD,
  database: ENV_VARIABLES.DATABASE_DATABASE_NAME,
  host: ENV_VARIABLES.DATABASE_HOST,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: false,
  migrationsRun: true,
  logging: hasDatabaseHost,
  seeds: [MainSeeder],
};

export const AppDataSource = new DataSource(options);
