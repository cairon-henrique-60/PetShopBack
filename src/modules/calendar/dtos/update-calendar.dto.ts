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

export class UpdateCalendarDTO extends createZodDto(updateCalendarSchema) {}
