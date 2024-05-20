import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { baseColumns } from '../entities/base-columns';

export class Calendars1716215270318 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'calendars',
        columns: [
          ...baseColumns,
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'initial_date',
            type: 'date',
          },
          {
            name: 'end_date',
            type: 'date',
          },
          {
            name: 'pet_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'location',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'notification_date',
            type: 'timestamp',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'calendars',
      new TableIndex({
        name: 'IDX_CALENDAR_DESCRIPTION',
        columnNames: ['description'],
      }),
    );

    await queryRunner.createIndex(
      'calendars',
      new TableIndex({
        name: 'IDX_CALENDAR_PET_ID',
        columnNames: ['pet_id'],
      }),
    );

    await queryRunner.createIndex(
      'calendars',
      new TableIndex({
        name: 'IDX_CALENDAR_USER_ID',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'calendars',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'calendars',
      new TableForeignKey({
        columnNames: ['pet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pets',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = (await queryRunner.getTable('calendars')) as Table;

    const foreignKeyUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    ) as TableForeignKey;
    const foreignKeyPet = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('pet_id') !== -1,
    ) as TableForeignKey;

    await queryRunner.dropForeignKey('calendars', foreignKeyUser);
    await queryRunner.dropForeignKey('calendars', foreignKeyPet);

    await queryRunner.dropIndex('calendars', 'IDX_CALENDAR_DESCRIPTION');
    await queryRunner.dropIndex('calendars', 'IDX_CALENDAR_PET_ID');
    await queryRunner.dropIndex('calendars', 'IDX_CALENDAR_USER_ID');

    await queryRunner.dropTable(table);
  }
}
