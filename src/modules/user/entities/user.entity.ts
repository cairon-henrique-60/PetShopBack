import { Entity, Column, Index, OneToMany } from 'typeorm';
import { compare } from 'bcrypt';

import { Base } from 'src/lib/database/entities/base.entity';
import { Pet } from 'src/modules/pet/entities/pet.entity';

import { createHashedPassword } from 'src/utils/password.utils';
import { UnauthorizedError } from 'src/lib/http-exceptions/errors/types/unauthorized-error';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

import { type UpdateUserType } from '../dtos/update-user.to';
import { type CreateUserPayload } from '../dtos/create-user.dto';

@Entity('users')
export class User extends Base {
  @Index()
  @Column('varchar')
  user_name: string;

  @Column('varchar', { nullable: true })
  hashed_password: string | null;

  @Column('varchar')
  user_email: string;

  @Column('varchar')
  user_type: string;

  @Column('varchar')
  user_auth_provider: string;

  @Column('varchar', { nullable: true })
  phone_number: string | null;

  @Column('boolean', { default: false })
  is_email_verified: boolean;

  @OneToMany(() => Pet, (pet) => pet.tutor)
  pets: Pet[];

  static async create(data: CreateUserPayload): Promise<User> {
    const userItem = new User();
    const hashed_password = data.password
      ? await createHashedPassword(data.password)
      : null;

    Object.assign(userItem, data);
    userItem.hashed_password = hashed_password;

    return userItem;
  }

  static async update(
    data: UpdateUserType,
    userPassword: string | null,
  ): Promise<User> {
    const userItem = new User();

    const { previous_password, ...rest } = data;

    if (
      previous_password !== undefined &&
      rest.new_password !== undefined &&
      userPassword !== null
    ) {
      const isMatch = await compare(previous_password, userPassword);

      if (!isMatch) {
        throw new UnauthorizedError('Password is not valid');
      }
    } else if (
      (previous_password !== undefined || rest.new_password !== undefined) &&
      userPassword !== null
    ) {
      throw new BadRequestError(
        'Both current_password and password are required!',
      );
    }

    const passwordHashed = data.previous_password
      ? await createHashedPassword(data.previous_password)
      : userPassword;

    Object.assign(userItem, rest);
    userItem.hashed_password = passwordHashed;
    return userItem;
  }
}
