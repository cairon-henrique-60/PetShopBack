import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { baseColumns } from '../entities/base-columns';

export class Activities1715882744298 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'activities',
        columns: [
          ...baseColumns,
          {
            name: 'activity_title',
            type: 'varchar',
          },
          {
            name: 'activity_description',
            type: 'varchar',
          },
          {
            name: 'activity_location',
            type: 'varchar',
          },
          {
            name: 'activity_date',
            type: 'date',
          },
          {
            name: 'activity_time',
            type: 'time with time zone',
          },
          {
            name: 'pet_id',
            type: 'uuid',
          },
          {
            name: 'activity_type_id',
            type: 'uuid',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_activities_activity_type',
            columnNames: ['activity_type_id'],
            referencedTableName: 'activity_types',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.dropForeignKey('activities', 'FK_activities_pet');
    await queryRunner.dropForeignKey(
      'activities',
      'FK_activities_activity_type',
    );

    // Drop the activities table
    await queryRunner.dropTable('activities');
  }
}
