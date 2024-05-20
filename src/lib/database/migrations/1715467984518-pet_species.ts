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
            isUnique: true,
          },
        ],
      }),
    );

    await queryRunner.query(`
    CREATE UNIQUE INDEX "IDX_species_name_unique_case_insensitive"
      ON "pet_species" (LOWER("species_name"));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'pet_breeds',
      'IDX_breed_name_unique_case_insensitive',
    );
    await queryRunner.dropTable('pet_species');
  }
}
