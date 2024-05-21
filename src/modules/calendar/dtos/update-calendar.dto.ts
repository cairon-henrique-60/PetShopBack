import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  optionalDateStringSchema,
  optionalStringSchema,
  optionalUuidSchema,
} from 'src/shared/schemas.shared';
import { today } from 'src/utils/date.utils';

export const updateCalendarSchema = z
  .object({
    description: optionalStringSchema,
    initial_date: optionalDateStringSchema,
    end_date: optionalDateStringSchema,
    pet_id: optionalUuidSchema,
    location: optionalStringSchema,
    notification_date: optionalDateStringSchema,
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

export type UpdateCalendarPayload = z.infer<typeof updateCalendarSchema>;

export class UpdateCalendarDTO extends createZodDto(updateCalendarSchema) {
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
}
