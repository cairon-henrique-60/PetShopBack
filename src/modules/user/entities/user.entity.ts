import { Entity, Column, Index, OneToMany } from 'typeorm';
import { compare } from 'bcrypt';

import { Base } from 'src/lib/database/entities/base.entity';
import { Pet } from 'src/modules/pet/entities/pet.entity';

import { UnauthorizedError } from 'src/lib/http-exceptions/errors/types/unauthorized-error';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

import { createHashedPassword } from 'src/utils/password.utils';

import { type CreateUserPayload } from '../dtos/create-user.dto';

import { type UpdateUserType } from '../dtos/update-user.to';

@Entity('users')
export class User extends Base {
  @Index()
  @Column('varchar')
  user_name: string;

  @Column({ length: 255 })
  hashed_password: string;

  @Column('varchar')
  user_email: string;

  @Column('varchar')
  type_user: string;

  @Column('varchar', { nullable: true })
  phone_number: string;

  @OneToMany(() => Pet, (pet) => pet.tutor)
  pets: Pet[];

  static async create(data: CreateUserPayload): Promise<User> {
    const userItem = new User();
    const passwordHashed = await createHashedPassword(data.password);

    Object.assign(userItem, data);
    userItem.hashed_password = passwordHashed;
    return userItem;
  }

  static async update(
    data: UpdateUserType,
    userPassword: string,
  ): Promise<User> {
    const userItem = new User();

    const { previous_password, ...rest } = data;

    if (previous_password !== undefined && rest.new_password !== undefined) {
      const isMatch = await compare(previous_password, userPassword);
      if (!isMatch) {
        throw new UnauthorizedError('Password is not valid');
      }
    } else if (
      previous_password !== undefined ||
      rest.new_password !== undefined
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
