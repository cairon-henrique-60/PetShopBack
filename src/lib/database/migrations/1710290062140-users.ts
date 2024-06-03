import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { baseColumns } from '../entities/base-columns';

export class Users1710290062140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          ...baseColumns,
          {
            name: 'hashed_password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'user_name',
            type: 'varchar',
          },
          {
            name: 'total_friends_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'user_type',
            type: 'varchar',
          },
          {
            name: 'user_auth_provider',
            type: 'varchar',
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'user_email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'is_email_verified',
            type: 'boolean',
            default: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
