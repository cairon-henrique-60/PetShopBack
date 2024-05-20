import { Repository } from 'typeorm';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { Calendar } from '../entities/calendar.entity';
import type { CreateCalendarPayload } from '../dtos/create-calendar.dto';
import type { UpdateCalendarPayload } from '../dtos/update-calendar.dto';
import type { PaginateCalendarsPayload } from '../dtos/paginate-calendars.dto';

@Injectable()
export class CalendarService {
  constructor(
    @Inject('CALENDAR_REPOSITORY')
    private calendarRepository: Repository<Calendar>,
    private readonly paginationService: PaginationService,
  ) {}

  private createCalendarQueryBuilder() {
    return this.calendarRepository
      .createQueryBuilder('calendar')
      .leftJoin('calendar.pet', 'pet')
      .leftJoin('calendar.user', 'user')
      .select([
        'calendar',
        'pet.id',
        'pet.pet_name',
        'pet.pet_breed_id',
        'pet.pet_species_id',
        'user.id',
        'user.user_name',
        'user.user_email',
      ]);
  }

  async paginateCalendars({
    limit,
    page,
    description,
    order_by_created_at,
    order_by_end_date,
    order_by_initial_date,
    order_by_updated_at,
    pet_id,
    user_id,
  }: PaginateCalendarsPayload) {
    const queryBuilder = this.createCalendarQueryBuilder()
      .andWhere(
        description ? 'calendar.description LIKE :description' : '1=1',
        { description: `%${description}%` },
      )
      .andWhere(pet_id ? 'pet.id = :pet_id' : '1=1', { pet_id })
      .andWhere(user_id ? 'user.id = :user_id' : '1=1', { user_id });

    if (order_by_created_at)
      queryBuilder.addOrderBy('calendar.created_at', order_by_created_at);

    if (order_by_end_date)
      queryBuilder.addOrderBy('calendar.end_date', order_by_end_date);

    if (order_by_initial_date)
      queryBuilder.addOrderBy('calendar.initial_date', order_by_initial_date);

    if (order_by_updated_at)
      queryBuilder.addOrderBy('calendar.updated_at', order_by_updated_at);

    return this.paginationService.paginateWithQueryBuilder(queryBuilder, {
      limit,
      page,
    });
  }

  async getCalendarById(id: string): Promise<Calendar> {
    const foundedCalendar = await this.createCalendarQueryBuilder()
      .where('calendar.id = :id', { id })
      .getOne();

    if (!foundedCalendar) throw new NotFoundError('Calendario não encontrado');

    return foundedCalendar;
  }

  async createCalendar(payload: CreateCalendarPayload): Promise<Calendar> {
    const calendarToCreate = Calendar.create(payload);

    return this.calendarRepository.save(calendarToCreate);
  }

  async updateCalendar(
    id: string,
    payload: UpdateCalendarPayload,
    current_user_id: string,
  ): Promise<Calendar> {
    const calendarToUpdate = await this.getCalendarById(id);

    this.checkIfCurrentUserMatchesWithCalendar(
      calendarToUpdate,
      current_user_id,
    );

    const calendarItem = Calendar.update(calendarToUpdate, payload);

    await this.calendarRepository.update(id, calendarItem);

    return this.getCalendarById(calendarToUpdate.id);
  }

  async deleteCalendar(id: string, current_user_id: string) {
    const calendarToDelete = await this.getCalendarById(id);

    this.checkIfCurrentUserMatchesWithCalendar(
      calendarToDelete,
      current_user_id,
    );

    return this.calendarRepository.remove(calendarToDelete);
  }

  private checkIfCurrentUserMatchesWithCalendar(
    calendar: Calendar,
    current_user_id: string,
  ) {
    if (calendar.user.id !== current_user_id) {
      throw new ForbiddenException(
        'Não é possivel deletar um calendario que não é seu',
      );
    }
  }
}