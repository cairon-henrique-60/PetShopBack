import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { baseColumns } from '../entities/base-columns';

export class Pets1715706222891 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pets',
        columns: [
          ...baseColumns,
          {
            name: 'pet_name',
            type: 'varchar',
          },
          {
            name: 'pet_species_id',
            type: 'uuid',
          },
          {
            name: 'pet_breed_id',
            type: 'uuid',
          },
          {
            name: 'date_of_birth',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'pet_gender',
            type: 'varchar',
          },
          {
            name: 'pet_color',
            type: 'varchar',
          },
          {
            name: 'alergies',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'medical_conditions',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'current_medication',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'pet_image_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'pet_microship_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'tutor_id',
            type: 'uuid',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['tutor_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['pet_species_id'],
            referencedTableName: 'pet_species',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['pet_breed_id'],
            referencedTableName: 'pet_breeds',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pets');
  }
}
