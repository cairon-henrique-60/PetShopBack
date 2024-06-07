import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

import {
  friendship_statuses,
  FriendshipStatus,
} from 'src/modules/friendship/enums/friendship-status.enum';

import { baseColumns } from '../entities/base-columns';

export class Friendships1717376956861 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'friendships',
        columns: [
          ...baseColumns,
          {
            name: 'initiator_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'recipient_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'blocked_by_id',
            type: 'uuid',
            isNullable: true,
            default: null,
          },
          {
            name: 'status',
            type: 'enum',
            enum: friendship_statuses,
            default: `'${FriendshipStatus.PENDING}'`,
          },
        ],
      }),
    );

    // Create indexes
    await queryRunner.createIndex(
      'friendships',
      new TableIndex({
        name: 'IDX_friendship_initiator_id',
        columnNames: ['initiator_id'],
      }),
    );

    await queryRunner.createIndex(
      'friendships',
      new TableIndex({
        name: 'IDX_friendship_recipient_id',
        columnNames: ['recipient_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'friendships',
      new TableForeignKey({
        columnNames: ['initiator_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'friendships',
      new TableForeignKey({
        columnNames: ['blocked_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'friendships',
      new TableForeignKey({
        columnNames: ['recipient_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('friendships');

    const foreignKeyInitiator = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('initiator_id') !== -1,
    );
    const foreignKeyRecipient = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('recipient_id') !== -1,
    );
    const foreignKeyBlockedBy = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('blocked_by_id') !== -1,
    );

    if (foreignKeyInitiator)
      await queryRunner.dropForeignKey('friendships', foreignKeyInitiator);

    if (foreignKeyRecipient)
      await queryRunner.dropForeignKey('friendships', foreignKeyRecipient);

    if (foreignKeyBlockedBy)
      await queryRunner.dropForeignKey('friendships', foreignKeyBlockedBy);

    await queryRunner.dropIndex('friendships', 'IDX_friendship_initiator_id');
    await queryRunner.dropIndex('friendships', 'IDX_friendship_recipient_id');

    await queryRunner.dropTable('friendships');
  }
}
