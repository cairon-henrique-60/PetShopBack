import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Post,
  Query,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';

import { Public } from 'src/shared/decorators/auth.decorator';
import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { DecodedToken } from 'src/shared/decorators/decoded-token.decorator';
import { ApiPaginationQuery } from 'src/shared/decorators/api-pagination-query.decorator';
import { DataBaseInterceptorDecorator } from 'src/shared/decorators/database-interceptor.decorator';

import { User } from '../entities/user.entity';
import { ListUsersDTO } from '../dtos/list-users.dto';
import { UpdateUserDTO } from '../dtos/update-user.to';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { PaginateUsersDTO } from '../dtos/paginate-users.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('paginate')
  @ApiPaginationQuery()
  async paginateUsers(
    @Query() querys: PaginateUsersDTO,
  ): Promise<Pagination<User>> {
    return this.userService.paginateUsers(querys);
  }

  @Get('list')
  async list(@Query() querys: ListUsersDTO): Promise<User[]> {
    return this.userService.listUser(querys);
  }

  @Get(':id')
  async getUserById(@UuidParam('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Public()
  @Post()
  @DataBaseInterceptorDecorator()
  create(@Body() createUserDto: CreateUserDTO): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @DataBaseInterceptorDecorator()
  async updateUser(
    @UuidParam('id') id: string,
    @Body() data: UpdateUserDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ): Promise<User> {
    return this.userService.updateUser(id, data, decoded_token.id);
  }

  @Delete(':id')
  async deleteUser(
    @UuidParam('id') id: string,
    @DecodedToken() decoded_token: DecodedTokenType,
  ): Promise<DeleteResult> {
    return this.userService.deleteUser(id, decoded_token.id);
  }
}
