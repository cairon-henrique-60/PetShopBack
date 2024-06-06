import { ForbiddenException, Injectable } from '@nestjs/common';

import { PetService } from 'src/modules/pet/services/pet.service';
import { UserTypeEnum } from 'src/modules/user/enum/user-type.enum';
import { UserService } from 'src/modules/user/services/user.service';
import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { Calendar } from '../entities/calendar.entity';
import { calendarRepository } from '../repository/calendar.repository';
import type { ListCalendarsPayload } from '../dtos/list-calendars.dto';
import type { CreateCalendarPayload } from '../dtos/create-calendar.dto';
import type { UpdateCalendarPayload } from '../dtos/update-calendar.dto';
import type { PaginateCalendarsPayload } from '../dtos/paginate-calendars.dto';

@Injectable()
export class CalendarService {
  constructor(
    private readonly petService: PetService,
    private readonly userService: UserService,
    private readonly paginationService: PaginationService,
  ) {}

  async listCalendars(payload: ListCalendarsPayload, user_id: string) {
    return this.handleCalendarsFilters(payload, user_id).getMany();
  }

  async paginateCalendars(
    { limit, page, ...payload }: PaginateCalendarsPayload,
    user_id: string,
  ) {
    const queryBuilder = this.handleCalendarsFilters(payload, user_id);

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

  async createCalendar(
    payload: CreateCalendarPayload,
    decoded_token: DecodedTokenType,
  ): Promise<Calendar> {
    const validatedPet = await this.petService.getPetById(payload.pet_id);

    if (
      decoded_token.user_type !== UserTypeEnum.COMPANY &&
      decoded_token.id !== validatedPet.tutor.id
    )
      throw new ForbiddenException('Erro');

    const calendarToCreate = Calendar.create({
      ...payload,
      user_id: decoded_token.id,
    });

    return calendarRepository.save(calendarToCreate);
  }

  async updateCalendar(
    id: string,
    payload: UpdateCalendarPayload,
    decoded_token: DecodedTokenType,
  ): Promise<Calendar> {
    const calendarToUpdate = await this.getCalendarById(id);

    this.checkIfCurrentUserMatchesWithCalendar(
      calendarToUpdate,
      decoded_token.id,
    );

    if (payload.pet_id) {
      const newPet = await this.petService.getPetById(payload.pet_id);

      if (
        decoded_token.user_type !== UserTypeEnum.COMMOM &&
        newPet.tutor.id !== decoded_token.id
      )
        throw new ForbiddenException('Erro');
    }

    const calendarItem = Calendar.update(payload);

    await calendarRepository.update(id, calendarItem);

    return this.getCalendarById(calendarToUpdate.id);
  }

  async deleteCalendar(id: string, current_user_id: string) {
    const calendarToDelete = await this.getCalendarById(id);

    this.checkIfCurrentUserMatchesWithCalendar(
      calendarToDelete,
      current_user_id,
    );

    return calendarRepository.remove(calendarToDelete);
  }

  private checkIfCurrentUserMatchesWithCalendar(
    calendar: Calendar,
    current_user_id: string,
  ) {
    if (calendar.user.id !== current_user_id) {
      throw new ForbiddenException(
        'Não é possivel deletar ou editar um calendario que não é seu',
      );
    }
  }

  private createCalendarQueryBuilder() {
    return calendarRepository
      .createQueryBuilder('calendar')
      .leftJoinAndSelect('calendar.pet', 'pet')
      .leftJoinAndSelect('calendar.user', 'user')
      .select([
        'calendar.id',
        'calendar.created_at',
        'calendar.updated_at',
        'calendar.description',
        'calendar.initial_date',
        'calendar.end_date',
        'calendar.location',
        'calendar.notification_date',
        'user.id',
        'user.user_name',
        'user.user_email',
        'pet',
        // 'pet.id',
        // 'pet.pet_name',
        // 'pet.pet_breed_id',
        // 'pet.pet_species_id',
      ]);
  }

  private handleCalendarsFilters(
    {
      description,
      order_by_created_at,
      order_by_end_date,
      order_by_initial_date,
      order_by_updated_at,
      pet_id,
      end_date,
      initial_date,
    }: ListCalendarsPayload,
    user_id: string,
  ) {
    const queryBuilder = this.createCalendarQueryBuilder()
      .where('calendar.user_id = :user_id', { user_id })
      .andWhere(
        description ? 'calendar.description LIKE :description' : '1=1',
        { description: `%${description}%` },
      )
      .andWhere(pet_id ? 'pet.id = :pet_id' : '1=1', { pet_id });

    if (initial_date)
      queryBuilder.andWhere('calendar.initial_date >= :initial_date', {
        initial_date,
      });

    if (end_date)
      queryBuilder.andWhere('calendar.end_date <= :end_date', { end_date });

    if (order_by_created_at)
      queryBuilder.addOrderBy('calendar.created_at', order_by_created_at);

    if (order_by_end_date)
      queryBuilder.addOrderBy('calendar.end_date', order_by_end_date);

    if (order_by_initial_date)
      queryBuilder.addOrderBy('calendar.initial_date', order_by_initial_date);

    if (order_by_updated_at)
      queryBuilder.addOrderBy('calendar.updated_at', order_by_updated_at);

    return queryBuilder;
  }
}
