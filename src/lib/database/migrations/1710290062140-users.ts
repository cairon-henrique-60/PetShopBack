import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import {
  UserAuthProviders,
  user_auth_providers,
} from 'src/modules/user/enum/user-auth-providers.enum';
import { UserTypeEnum, user_types } from 'src/modules/user/enum/user-type.enum';

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
            type: 'enum',
            enum: user_types,
            default: `'${UserTypeEnum.COMMOM}'`,
          },
          {
            name: 'user_auth_provider',
            type: 'enum',
            enum: user_auth_providers,
            default: `'${UserAuthProviders.EMAIL}'`,
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
