import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../entities/base-columns';

export class ActivityTypes1715869215493 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'activity_types',
        columns: [
          ...baseColumns,
          {
            name: 'activity_name',
            type: 'varchar',
          },
          {
            name: 'activity_description',
            type: 'varchar',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('activity_types');
  }
}
