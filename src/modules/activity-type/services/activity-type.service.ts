import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { ActivityType } from '../entities/activity-type.entity';
import type { ActivityTypesFilters } from '../dtos/get-all-activity-types.dto';
import type { CreateActivityTypePayload } from '../dtos/create-activity-type.dto';
import type { UpdateActivityTypePayload } from '../dtos/update-activity-type.dto';
import type { PaginateActivityTypesPayload } from '../dtos/paginate-activity-types.dto';

@Injectable()
export class ActivityTypeService {
  constructor(
    @Inject('ACTIVITY_TYPE_REPOSITORY')
    private activityTypeRepository: Repository<ActivityType>,
    private readonly paginationService: PaginationService,
  ) {}

  private handleActivityTypeSearchFilters({
    activity_description,
    activity_name,
    order_by_created_at,
    order_by_updated_at,
  }: ActivityTypesFilters) {
    const activityTypesQueryBuilder = this.activityTypeRepository
      .createQueryBuilder('activity_type')
      .select([
        'activity_type.id',
        'activity_type.created_at',
        'activity_type.updated_at',
        'activity_type.activity_name',
        'activity_type.activity_description',
      ])
      .where(
        activity_name
          ? 'activity_type.activity_name LIKE :activity_name'
          : '1=1',
        { activity_name: `%${activity_name}%` },
      )
      .andWhere(
        activity_description
          ? 'activity_type.activity_description LIKE :activity_description'
          : '1=1',
        {
          activity_description: `%${activity_description}%`,
        },
      );

    if (order_by_created_at)
      activityTypesQueryBuilder.orderBy(
        'activity_type.created_at',
        order_by_created_at,
      );

    if (order_by_updated_at)
      activityTypesQueryBuilder.orderBy(
        'activity_type.updated_at',
        order_by_updated_at,
      );

    return activityTypesQueryBuilder;
  }

  async getAllActivityTypes({
    activity_description,
    activity_name,
    order_by_created_at,
    order_by_updated_at,
  }: ActivityTypesFilters) {
    const activityTypesQueryBuilder = this.handleActivityTypeSearchFilters({
      activity_description,
      activity_name,
      order_by_created_at,
      order_by_updated_at,
    });

    return activityTypesQueryBuilder.getMany();
  }

  async paginateActivityTypes({
    limit,
    page,
    activity_description,
    activity_name,
    order_by_created_at,
    order_by_updated_at,
  }: PaginateActivityTypesPayload) {
    const activityTypesQueryBuilder = this.handleActivityTypeSearchFilters({
      activity_description,
      activity_name,
      order_by_created_at,
      order_by_updated_at,
    });

    return this.paginationService.paginateWithQueryBuilder(
      activityTypesQueryBuilder,
      { limit, page },
    );
  }

  async getActivityTypeById(id: string): Promise<ActivityType> {
    const foundedActivityType = await this.activityTypeRepository.findOne({
      where: { id },
    });

    if (!foundedActivityType) {
      throw new NotFoundError('Atividade não encotrada');
    }

    return foundedActivityType;
  }

  async createActivityType(
    payload: CreateActivityTypePayload,
  ): Promise<ActivityType> {
    const activityToCreate = this.activityTypeRepository.create(payload);

    return this.activityTypeRepository.save(activityToCreate);
  }

  async updateActivityType(id: string, payload: UpdateActivityTypePayload) {
    const activityToUpdate = await this.getActivityTypeById(id);

    const activityItem = ActivityType.update(payload);

    await this.activityTypeRepository.update(activityToUpdate.id, activityItem);

    return this.getActivityTypeById(activityToUpdate.id);
  }

  async deleteActivityType(id: string) {
    const activityToDelete = await this.getActivityTypeById(id);

    return this.activityTypeRepository.remove(activityToDelete);
  }
}
