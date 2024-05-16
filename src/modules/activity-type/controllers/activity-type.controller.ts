import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { orderByFields } from 'src/config/swagger.config';
import { Public } from 'src/shared/decorators/auth.decorator';
import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { ApiPaginationQuery } from 'src/shared/decorators/api-pagination-query.decorator';

import { ActivityTypeService } from '../services/activity-type.service';
import { CreateActivityTypeDTO } from '../dtos/create-activity-type.dto';
import { UpdateActivityTypeDTO } from '../dtos/update-activity-type.dto';
import { PaginateActivityTypesDTO } from '../dtos/paginate-activity-types.dto';
import { ActivityTypesFiltersDTO } from '../dtos/get-all-activity-types.dto';

@ApiTags('activity-type')
@Controller('activity-type')
export class ActivityTypeController {
  constructor(private readonly activityTypeService: ActivityTypeService) {}

  @Public()
  @Get('paginate')
  @ApiPaginationQuery(orderByFields)
  async paginate(@Query() querys: PaginateActivityTypesDTO) {
    return this.activityTypeService.paginateActivityTypes(querys);
  }

  @Public()
  @Get()
  async getAll(@Query() querys: ActivityTypesFiltersDTO) {
    return this.activityTypeService.getAllActivityTypes(querys);
  }

  @Public()
  @Get(':id')
  async getById(@UuidParam('id') id: string) {
    return this.activityTypeService.getActivityTypeById(id);
  }

  @Public()
  @Post('')
  async create(@Body() payload: CreateActivityTypeDTO) {
    return this.activityTypeService.createActivityType(payload);
  }

  @Put(':id')
  async update(
    @UuidParam('id') id: string,
    @Body() payload: UpdateActivityTypeDTO,
  ) {
    return this.activityTypeService.updateActivityType(id, payload);
  }

  @Delete(':id')
  async delete(@UuidParam('id') id: string) {
    return this.activityTypeService.deleteActivityType(id);
  }
}
