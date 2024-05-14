import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PetSpecies1715706181455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
        new Table({
          name: 'pet_breeds',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              generationStrategy: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'breed_name',
              type: 'varchar',
            },
            {
              name: 'species_id',
              type: 'uuid',
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
          ],
          foreignKeys: [
            {
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
    await queryRunner.dropTable('pet_breeds');
  }
}
