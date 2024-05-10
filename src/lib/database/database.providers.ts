import { DataSource } from 'typeorm';
import * as path from 'path';

import { ENV_VARIABLES } from 'src/config/env.config';

const entitiesPath = path.resolve(__dirname, '../../**/*.entity{.ts,.js}');
const migrationsPath = path.resolve(
  __dirname,
  '../../lib/database/migrations/{*.ts,*.js}',
);

const hasDatabaseHost = ENV_VARIABLES.DATABASE_HOST === 'localhost';

const dataSource = new DataSource({
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
  logging: hasDatabaseHost ? true : false,
  ssl: !hasDatabaseHost ? true : false,
});

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];
