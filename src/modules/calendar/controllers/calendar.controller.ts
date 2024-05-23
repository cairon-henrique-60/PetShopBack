import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { orderByFields } from 'src/config/swagger.config';
import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { DecodedToken } from 'src/shared/decorators/decoded-token.decorator';
import { ApiPaginationQuery } from 'src/shared/decorators/api-pagination-query.decorator';
import { DataBaseInterceptor } from 'src/lib/http-exceptions/errors/interceptors/database.interceptor';

import { ListCalendarsDTO } from '../dtos/list-calendars.dto';
import { CalendarService } from '../services/calendar.service';
import { CreateCalendarDTO } from '../dtos/create-calendar.dto';
import { UpdateCalendarDTO } from '../dtos/update-calendar.dto';
import { PaginateCalendarsDTO } from '../dtos/paginate-calendars.dto';

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  getAll(
    @Query() querys: ListCalendarsDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.calendarService.listCalendars(querys, decoded_token.id);
  }

  @Get('paginate')
  @ApiPaginationQuery(orderByFields)
  paginate(
    @Query() querys: PaginateCalendarsDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.calendarService.paginateCalendars(querys, decoded_token.id);
  }

  @Get(':id')
  getById(@UuidParam('id') id: string) {
    return this.calendarService.getCalendarById(id);
  }

  @Post()
  @UseInterceptors(DataBaseInterceptor)
  create(
    @Body() payload: CreateCalendarDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.calendarService.createCalendar(payload, decoded_token.id);
  }

  @Put(':id')
  update(
    @UuidParam('id') id: string,
    @Body() payload: UpdateCalendarDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.calendarService.updateCalendar(id, payload, decoded_token.id);
  }

  @Delete(':id')
  delete(
    @UuidParam('id') id: string,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.calendarService.deleteCalendar(id, decoded_token.id);
  }
}
