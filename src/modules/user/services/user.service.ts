import {
  Between,
  DeleteResult,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { isNullableValue } from 'src/utils/is-nullable-value.util';
import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { User } from '../entities/user.entity';
import type { UpdateUserType } from '../dtos/update-user.to';
import type { ListUsersPayload } from '../dtos/list-users.dto';
import type { CreateUserPayload } from '../dtos/create-user.dto';
import type { PaginateUsersPayload } from '../dtos/paginate-users.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  async paginateUsers({ limit, page, ...params }: PaginateUsersPayload) {
    const whereClause = this.buildWhereClause(params);

    const queryBuilder = this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.id',
        'u.user_name',
        'u.user_email',
        'u.created_at',
        'u.updated_at',
      ])
      .leftJoinAndSelect('u.pets', 'pets')
      .where(whereClause);

    const paginatedHotelsResult =
      await this.paginationService.paginateWithQueryBuilder(queryBuilder, {
        limit,
        page,
      });

    return Promise.resolve(paginatedHotelsResult);
  }

  async getUserByEmail(user_email: string): Promise<User> {
    const foundedUser = await this.userRepository.findOne({
      where: { user_email },
      select: [
        'id',
        'created_at',
        'updated_at',
        'user_email',
        'user_name',
        'hashed_password',
      ],
      loadEagerRelations: false,
    });

    if (!foundedUser) {
      throw new NotFoundError('Usuario não encontrado');
    }

    return foundedUser;
  }

  async listUser(params: ListUsersPayload): Promise<User[]> {
    const whereClause = this.buildWhereClause(params);

    const users = await this.userRepository.find({
      where: whereClause,
      select: ['created_at', 'id', 'updated_at', 'user_email', 'user_name'],
      relations: ['pets'],
      loadEagerRelations: false,
    });

    return users;
  }

  async getUserById(id: string): Promise<User> {
    const foundedUser = await this.userRepository.findOne({
      where: { id },
      select: ['created_at', 'id', 'updated_at', 'user_email', 'user_name'],
      relations: ['pets'],
      loadEagerRelations: false,
    });

    if (!foundedUser) {
      throw new NotFoundError('Usuario não encontrado');
    }

    return foundedUser;
  }

  async createUser(params: CreateUserPayload): Promise<User> {
    const user: CreateUserPayload = {
      ...params,
    };

    const userItem = await User.create(user);

    const newUser = await this.userRepository.save(userItem);

    return this.getUserById(newUser.id);
  }

  async updateUser(id: string, params: UpdateUserType): Promise<User> {
    const user = await this.getUserById(id);
    const userEmail = await this.getUserByEmail(user.user_email);

    const userItem: UpdateUserType = {
      ...params,
    };

    const newUser = await User.update(userItem, userEmail.hashed_password);

    await this.userRepository.update(id, newUser);

    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    await this.getUserById(id);

    return this.userRepository.delete(id);
  }

  // private metods
  private buildWhereClause(params: ListUsersPayload): ListUsersPayload {
    const whereClause: Record<string, any> = {};

    if (params.initialDate && params.endDate) {
      whereClause['created_at'] = Between(params.initialDate, params.endDate);
    } else if (params.initialDate) {
      whereClause['created_at'] = MoreThanOrEqual(params.initialDate);
    } else if (params.endDate) {
      whereClause['created_at'] = LessThanOrEqual(params.endDate);
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
