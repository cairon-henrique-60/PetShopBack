import {
  Between,
  DeleteResult,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
} from 'typeorm';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { isNullableValue } from 'src/utils/is-nullable-value.util';
import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

import { User } from '../entities/user.entity';
import { userRepository } from '../repository/user.repository';
import type { UpdateUserType } from '../dtos/update-user.to';
import type { ListUsersPayload } from '../dtos/list-users.dto';
import type { CreateUserPayload } from '../dtos/create-user.dto';
import type { PaginateUsersPayload } from '../dtos/paginate-users.dto';

@Injectable()
export class UserService {
  constructor(private readonly paginationService: PaginationService) {}

  async paginateUsers({ limit, page, ...params }: PaginateUsersPayload) {
    const whereClause = this.buildWhereClause(params);

    const queryBuilder = userRepository
      .createQueryBuilder('u')
      .select([
        'u.id',
        'u.user_name',
        'u.user_email',
        'u.created_at',
        'u.updated_at',
        'u.user_type',
      ])
      .where(whereClause);

    return this.paginationService.paginateWithQueryBuilder(queryBuilder, {
      limit,
      page,
    });
  }

  async getUserByEmail(user_email: string): Promise<User> {
    const foundedUser = await userRepository.findOne({
      where: { user_email },
      select: [
        'id',
        'created_at',
        'updated_at',
        'user_email',
        'user_name',
        'hashed_password',
        'user_type',
        'is_email_verified',
        'phone_number',
      ],
      loadEagerRelations: false,
    });

    if (!foundedUser) {
      throw new BadRequestError('Email não existe no banco de dados');
    }

    return foundedUser;
  }

  async listUser(params: ListUsersPayload): Promise<User[]> {
    const whereClause = this.buildWhereClause(params);

    const users = await userRepository.find({
      where: whereClause,
      select: ['created_at', 'id', 'updated_at', 'user_email', 'user_name'],
      relations: ['pets'],
      loadEagerRelations: false,
    });

    return users;
  }

  async getUserById(id: string, selectPassword?: boolean): Promise<User> {
    const foundedUser = await userRepository.findOne({
      where: { id },
      select: {
        created_at: true,
        id: true,
        updated_at: true,
        user_email: true,
        user_name: true,
        user_type: true,
        hashed_password: selectPassword,
      },
      relations: ['pets'],
      loadEagerRelations: false,
    });

    if (!foundedUser) {
      throw new NotFoundError('Usuario não encontrado');
    }

    return foundedUser;
  }

  async createUser(payload: CreateUserPayload): Promise<User> {
    const userItem = await User.create(payload);

    return userRepository.save(userItem);
  }

  async updateUser(
    id: string,
    payload: UpdateUserType,
    logged_in_user_id: string,
  ): Promise<User> {
    const user = await this.getUserById(id, true);

    this.checkUserPermission(user.id, logged_in_user_id);

    const newUser = await User.update(payload, user.hashed_password);

    await userRepository.update(id, newUser);

    return this.getUserById(id);
  }

  async deleteUser(
    id: string,
    logged_in_user_id: string,
  ): Promise<DeleteResult> {
    const userToDelete = await this.getUserById(id);

    this.checkUserPermission(userToDelete.id, logged_in_user_id);

    return userRepository.delete(userToDelete.id);
  }

  private checkUserPermission(incoming_id: string, logged_in_user_id: string) {
    if (incoming_id !== logged_in_user_id) {
      throw new ForbiddenException(
        'Não é permitido alterar ou deletar um usuario que não é seu',
      );
    }
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
