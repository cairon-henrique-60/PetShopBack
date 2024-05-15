import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { baseColumns } from '../entities/base-columns';

export class Pet1715467984518 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pet_species',
        columns: [
          ...baseColumns,
          {
            name: 'species_name',
            type: 'varchar',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pet_species');
  }
}
