import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Pet1715467984518 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pet_species',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            generationStrategy: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'species_name',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'pets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            generationStrategy: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'pet_name',
            type: 'varchar',
          },
          {
            name: 'pet_species_id',
            type: 'uuid',
          },
          {
            name: 'pet_breed',
            type: 'varchar',
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
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
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
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pets');
    await queryRunner.dropTable('pet_species');
  }
}
