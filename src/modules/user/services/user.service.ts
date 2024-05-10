import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';

import {
  createHashedPassword,
  validatePassword,
} from 'src/utils/password.utils';
import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

import { User } from '../entities/user.entity';
import type { UpdateUserType } from '../dtos/update-user.to';
import type { CreateUserPayload } from '../dtos/create-user.dto';
import type { PaginateUsersPayload } from '../dtos/paginate-users.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  async paginateUsers({ limit, page }: PaginateUsersPayload) {
    return this.paginationService.paginate(
      this.userRepository,
      {
        limit,
        page,
      },
      { select: ['createdAt', 'id', 'user_email', 'user_name', 'updatedAt'] },
    );
  }

  public async getUserByEmail(user_email: string): Promise<User> {
    const foundedUser = await this.userRepository.findOne({
      where: { user_email },
      select: ['createdAt', 'id', 'updatedAt', 'user_email', 'user_name'],
    });

    if (!foundedUser) {
      throw new NotFoundError('Usuario não encontrado');
    }

    return foundedUser;
  }

  public async getUserById(id: string): Promise<User> {
    const foundedUser = await this.userRepository.findOne({
      where: { id },
      select: ['createdAt', 'id', 'updatedAt', 'user_email', 'user_name'],
    });

    if (!foundedUser) {
      throw new NotFoundError('Usuario não encontrado');
    }

    return foundedUser;
  }

  public async createUser({
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
      if (updateUserPayload.new_password.length < 8) {
        throw new BadRequestError(
          'New password must be at least 8 characters long',
        );
      }

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
}
