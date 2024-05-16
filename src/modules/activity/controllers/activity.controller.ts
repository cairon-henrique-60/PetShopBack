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

import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';

import { ActivityService } from '../services/activity.service';
import { CreateActivityDTO } from '../dtos/create-activity.dto';
import { UpdateActivityDTO } from '../dtos/update-activity.dto';
import { PaginateActivitiesDTO } from '../dtos/paginate-activities.dto';

@ApiTags('activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('paginate')
  async paginate(@Query() querys: PaginateActivitiesDTO) {
    return this.activityService.paginateActivities(querys);
  }

  @Get(':id')
  async getById(@UuidParam('id') id: string) {
    return this.activityService.getActivityById(id);
  }

  @Post('')
  async create(@Body() payload: CreateActivityDTO) {
    return this.activityService.createActivity(payload);
  }

  @Put(':id')
  async update(
    @UuidParam('id') id: string,
    @Body() payload: UpdateActivityDTO,
  ) {
    return this.activityService.updateActivity(id, payload);
  }

  @Delete(':id')
  async delete(@UuidParam('id') id: string) {
    return this.activityService.deleteActivity(id);
  }
}
