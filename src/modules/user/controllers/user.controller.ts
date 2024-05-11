import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { Public } from 'src/shared/decorators/auth.decorator';
import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { ApiPaginationQuery } from 'src/shared/decorators/api-pagination-query.decorator';
import { DataBaseInterceptor } from 'src/lib/http-exceptions/errors/interceptors/database.interceptor';

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

  @Get()
  async list(@Query() querys: ListUsersDTO) {
    return this.userService.listUser(querys);
  }

  @Get('paginate')
  @ApiPaginationQuery()
  async paginateUsers(@Query() querys: PaginateUsersDTO) {
    return this.userService.paginateUsers(querys);
  }

  @Get(':id')
  async getUserById(@UuidParam('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Public()
  @Post()
  @UseInterceptors(DataBaseInterceptor)
  create(@Body() createUserDto: CreateUserDTO): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @UseInterceptors(DataBaseInterceptor)
  async updateUser(@UuidParam('id') id: string, @Body() data: UpdateUserDTO) {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@UuidParam('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
