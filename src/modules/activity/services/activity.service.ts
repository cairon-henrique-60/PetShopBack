import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { Activity } from '../entities/activity.entity';
import type { CreateActivityPayload } from '../dtos/create-activity.dto';
import type { UpdateActivityPayload } from '../dtos/update-activity.dto';
import type { PaginateActivitiesPayload } from '../dtos/paginate-activities.dto';

@Injectable()
export class ActivityService {
  constructor(
    @Inject('ACTIVITY_REPOSITORY')
    private activityRepository: Repository<Activity>,
    private readonly paginationService: PaginationService,
  ) {}

  // private createActivityQueryBuilder() {
  //   return this.activityRepository
  //     .createQueryBuilder('activity')
  //     .leftJoinAndSelect('activity.pet', 'pet')
  //     .leftJoinAndSelect('activity.activity_type', 'activity_type')
  //     // .leftJoinAndSelect('pet.tutor', 'tutor')
  //     .select([
  //       'activity.id',
  //       'activity.created_at',
  //       'activity.updated_at',
  //       'activity.activity_title',
  //       'activity.activity_description',
  //       'activity.activity_location',
  //       'activity.activity_date',
  //       'activity.activity_time',
  //       'pet.id',
  //       'pet.pet_name',
  //       'pet.pet_image_url',
  //       'activity_type.id',
  //       'activity_type.activity_name',
  //       'activity_type.activity_description',
  //       // 'tutor.id',
  //       // 'tutor.user_name',
  //       // 'tutor.user_email',
  //     ]);
  // }

  private createActivityQueryBuilder() {
    return this.activityRepository
      .createQueryBuilder('activity')
      .select(['activity', 'pet', 'activity_type'])
      .leftJoin('activity.pet', 'pet')
      .leftJoinAndSelect('a.tutor.id', 'a');
  }

  private handleActivitySearchFilters({
    activity_description,
    activity_location,
    activity_title,
    activity_type_id,
    order_by_created_at,
    order_by_updated_at,
    pet_id,
  }: Omit<PaginateActivitiesPayload, 'limit' | 'page'>) {
    const activityQueryBuilder = this.createActivityQueryBuilder()
      .where(
        activity_type_id
          ? 'activity.activity_type.activity_type_id = :activity_type_id'
          : '1=1',
        { activity_type_id },
      )
      .andWhere(pet_id ? 'activity.pet.id = :pet_id' : '1=1', { pet_id })
      .andWhere(
        activity_description
          ? 'activity.activity_description LIKE :activity_description'
          : '1=1',
        { activity_description: `%${activity_description}%` },
      )
      .andWhere(
        activity_title ? 'activity.activity_title LIKE :activity_title' : '1=1',
        { activity_title: `%${activity_title}%` },
      )
      .andWhere(
        activity_location
          ? 'activity.activity_location LIKE :activity_location'
          : '1=1',
        { activity_location: `%${activity_location}%` },
      );

    if (order_by_created_at)
      activityQueryBuilder.orderBy('activity.created_at', order_by_created_at);

    if (order_by_updated_at)
      activityQueryBuilder.orderBy('activity.updated_at', order_by_updated_at);

    return activityQueryBuilder;
  }

  async paginateActivities({
    limit,
    page,
    ...params
  }: PaginateActivitiesPayload) {
    const activityQueryBuilder = this.handleActivitySearchFilters(params);

    return this.paginationService.paginateWithQueryBuilder(
      activityQueryBuilder,
      { limit, page },
    );
  }

  async getActivityById(id: string) {
    const foundedActivity = await this.createActivityQueryBuilder()
      .where('activity.id = :id', { id })
      .getOne();

    if (!foundedActivity) {
      throw new NotFoundError('Atividade não encontrada');
    }

    return foundedActivity;
  }

  async createActivity(payload: CreateActivityPayload) {
    const itemToCreate = this.activityRepository.create(payload);

    return this.activityRepository.save(itemToCreate);
  }

  async updateActivity(id: string, payload: UpdateActivityPayload) {
    const { id: activity_id } = await this.getActivityById(id);
    const itemToUpdate = Activity.update(payload);

    await this.activityRepository.update(activity_id, itemToUpdate);

    return this.getActivityById(activity_id);
  }

  async deleteActivity(id: string) {
    const activityToDelete = await this.getActivityById(id);

    return this.activityRepository.remove(activityToDelete);
  }
}
