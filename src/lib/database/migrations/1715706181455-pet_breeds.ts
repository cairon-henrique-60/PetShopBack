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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('pet_breeds', 'FK_pet_breeds_species_id');
    await queryRunner.dropTable('pet_breeds');
  }
}
