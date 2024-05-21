import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  optionalDatetimeStringSchema,
  optionalOrderParamSchema,
  optionalStringSchema,
  optionalUuidSchema,
} from 'src/shared/schemas.shared';
import { today } from 'src/utils/date.utils';

export const listCalendarsSchema = z
  .object({
    description: optionalStringSchema,
    pet_id: optionalUuidSchema,
    user_id: optionalUuidSchema,
    end_date: optionalDatetimeStringSchema,
    initial_date: optionalDatetimeStringSchema,
    order_by_created_at: optionalOrderParamSchema,
    order_by_updated_at: optionalOrderParamSchema,
    order_by_initial_date: optionalOrderParamSchema,
    order_by_end_date: optionalOrderParamSchema,
  })
  .refine(
    ({ end_date, initial_date }) => {
      if (!end_date && !initial_date) return true;

      if (initial_date && initial_date < new Date(today)) return false;

      if (end_date && initial_date && end_date <= initial_date) return false;

      return true;
    },
    {
      message:
        'Initial date must be later or equal to today and end date must be later than initial date',
      path: ['initial_date', 'end_date'],
    },
  );

export type ListCalendarsPayload = z.infer<typeof listCalendarsSchema>;

export class ListCalendarsDTO extends createZodDto(listCalendarsSchema) {
  /**
   * Description of the event.
   * @example Pet vaccination
   */
  description?: string;
  /**
   * Initial date of the event.
   * @example 2024-08-10T08:00:00Z
   */
  initial_date?: Date;
  /**
   * End date date of the event.
   * @example 2024-08-10T10:00:00Z
   */
  end_date?: Date;
  /**
   * Pet of the event.
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  pet_id?: string;
  /**
   * Location of the event.
   * @example Veterinarian
   */
  location?: string;
  /**
   * Notification of the event.
   * @example 2024-08-10T07:30:00Z
   */
  notification_date?: Date;
  /**
   * Tutor id of the event.
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  user_id?: string;
  /**
   * Order by createdAt of the event.
   * @example 'ASC' | 'DESC'
   */
  order_by_created_at?: 'ASC' | 'DESC';
  /**
   * Order by updated_at of the event.
   * @example 'ASC' | 'DESC'
   */
  order_by_updated_at?: 'ASC' | 'DESC';
  /**
   * Order by initialDate of the event.
   * @example 'ASC' | 'DESC'
   */
  order_by_initial_date?: 'ASC' | 'DESC';
  /**
   * Order by endDate of the event.
   * @example 'ASC' | 'DESC'
   */
  order_by_end_date?: 'ASC' | 'DESC';
}
