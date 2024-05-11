import {
  Between,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import {
  createHashedPassword,
  validatePassword,
} from 'src/utils/password.utils';
import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

import { User } from '../entities/user.entity';
import type { UpdateUserType } from '../dtos/update-user.to';
import type { ListUsersPayload } from '../dtos/list-users.dto';
import type { CreateUserPayload } from '../dtos/create-user.dto';
import type { PaginateUsersPayload } from '../dtos/paginate-users.dto';
import { isNullableValue } from 'src/utils/is-nullable-value.util';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  // async paginateUser({ limit, page, ...params }: PaginateUsersPayload) {
  //   const paginatedHotelsResult = await this.paginationService.paginate(
  //     this.userRepository,
  //     {
  //       limit,
  //       page,
  //     },
  //     {
  //       where: {
  //         user_email: params.user_email,
  //         user_name: params.user_name,
  //       },
  //       select: {
  //         id: true,
  //         user_name: true,
  //         user_email: true,
  //         createdAt: true,
  //         updatedAt: true,
  //       },
  //     },
  //   );

  //   return Promise.resolve(paginatedHotelsResult);
  // }

  async paginateUsers(params: PaginateUsersPayload): Promise<Pagination<User>> {
    const { limit, page, ...rest } = params;

    const whereClause: ListUsersPayload = this.buildWhereClause(rest);

    const options: IPaginationOptions = {
      limit: limit || 1,
      page: page || 10,
    };

    const queryBuilder = this.userRepository.createQueryBuilder('u');
    queryBuilder
      .select(['u.user_name', 'u.user_email', 'u.createdAt', 'u.updatedAt'])
      .where(whereClause);

    return paginate<User>(queryBuilder, options);
  }

  async getUserByEmail(user_email: string): Promise<User> {
    const foundedUser = await this.userRepository.findOne({
      where: { user_email },
      select: [
        'createdAt',
        'id',
        'updatedAt',
        'user_email',
        'user_name',
        'hashed_password',
      ],
    });

    if (!foundedUser) {
      throw new NotFoundError('Usuario não encontrado');
    }

    return foundedUser;
  }

  async listUser(params: ListUsersPayload): Promise<User[]> {
    const whereClause: ListUsersPayload = this.buildWhereClause(params);

    const users = await this.userRepository.find({
      where: whereClause,
      select: ['createdAt', 'id', 'updatedAt', 'user_email', 'user_name'],
    });

    return users;
  }

  async getUserById(id: string): Promise<User> {
    const foundedUser = await this.userRepository.findOne({
      where: { id },
      select: ['createdAt', 'id', 'updatedAt', 'user_email', 'user_name'],
    });

    if (!foundedUser) {
      throw new NotFoundError('Usuario não encontrado');
    }

    return foundedUser;
  }

  async createUser({
    password,
    user_email,
    user_name,
  }: CreateUserPayload): Promise<User> {
    const hashed_password = await createHashedPassword(password);

    const newUser = this.userRepository.create();

    Object.assign(newUser, { user_email, user_name, hashed_password });

    return this.userRepository.save(newUser);
  }

  async updateUser(
    id: string,
    updateUserPayload: UpdateUserType,
  ): Promise<User> {
    const userToUpdate = await this.getUserById(id);

    const userItem = new User();

    if (updateUserPayload.previous_password) {
      const passwordsMatch = await validatePassword(
        updateUserPayload.previous_password,
        userToUpdate.hashed_password,
      );

      if (!passwordsMatch) {
        throw new BadRequestError('Previous password is incorrect');
      }
    }

    if (updateUserPayload.new_password) {
      userItem.hashed_password = await createHashedPassword(
        updateUserPayload.new_password,
      );
    }

    Object.assign(userItem, {
      user_name: updateUserPayload.user_name ?? userToUpdate.user_name,
      user_email: updateUserPayload.user_email ?? userToUpdate.user_email,
    });

    await this.userRepository.update(id, userItem);

    return this.getUserById(userToUpdate.id);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);

    await this.userRepository.remove(user);
  }

  // private metods
  private buildWhereClause(params: ListUsersPayload): object {
    const whereClause: { [key: string]: any } = {};

    if (params.initialDate && params.endDate) {
      whereClause['createdAt'] = Between(params.initialDate, params.endDate);
    } else if (params.initialDate) {
      whereClause['createdAt'] = MoreThanOrEqual(params.initialDate);
    } else if (params.endDate) {
      whereClause['createdAt'] = LessThanOrEqual(params.endDate);
    }

    Object.entries(params).forEach(([key, value]) => {
      if (
        !isNullableValue(value) &&
        key !== 'initialDate' &&
        key !== 'endDate'
      ) {
        whereClause[key] = Like(`%${value}%`);
      }
    });

    return whereClause;
  }
}
