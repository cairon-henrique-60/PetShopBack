import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { baseColumns } from '../entities/base-columns';

export class PetSpecies1715706181455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pet_breeds',
        columns: [
          ...baseColumns,
          {
            name: 'breed_name',
            type: 'varchar',
          },
          {
            name: 'species_id',
            type: 'uuid',
            isUnique: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK_pet_breeds_species_id',
            columnNames: ['species_id'],
            referencedTableName: 'pet_species',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
    );

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_breed_name_unique_case_insensitive"
      ON "pet_breeds" (LOWER("breed_name"));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'pet_breeds',
      'IDX_breed_name_unique_case_insensitive',
    );
    await queryRunner.dropForeignKey('pet_breeds', 'FK_pet_breeds_species_id');
    await queryRunner.dropTable('pet_breeds');
  }
}
