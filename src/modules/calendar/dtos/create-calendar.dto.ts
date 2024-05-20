import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  datetimeStringSchema,
  optionalDateStringSchema,
  stringSchema,
  uuidSchema,
} from 'src/shared/schemas.shared';
import { today } from 'src/utils/date.utils';

export const createCalendarSchema = z
  .object({
    description: stringSchema,
    initial_date: datetimeStringSchema,
    end_date: datetimeStringSchema,
    pet_id: uuidSchema,
    location: stringSchema,
    notification_date: optionalDateStringSchema,
  })
  .refine(
    ({ end_date, initial_date }) => {
      if (initial_date < new Date(today)) return false;

      if (end_date <= initial_date) return false;

      return true;
    },
    {
      message:
        'Initial date must be later or equal to today and end date must be later than initial date',
      path: ['initial_date', 'end_date'],
    },
  );

export type CreateCalendarPayload = z.infer<typeof createCalendarSchema> & {
  user_id: string;
};

export class CreateCalendarDTO extends createZodDto(createCalendarSchema) {}
