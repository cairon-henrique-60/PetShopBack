import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';

import { ApiPaginationQuery } from 'src/shared/decorators/api-pagination-query.decorator';

import { UserService } from '../services/user.service';
import { PaginateUsersDTO } from '../dtos/paginate-users.dto';
import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { UpdateUserDTO } from '../dtos/update-user.to';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('paginate')
  @ApiPaginationQuery()
  async paginateUsers(@Query() querys: PaginateUsersDTO) {
    return this.userService.paginateUsers(querys);
  }

  @Get(':id')
  async getUserById(@UuidParam('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  async updateUser(@UuidParam('id') id: string, @Body() data: UpdateUserDTO) {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@UuidParam('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
