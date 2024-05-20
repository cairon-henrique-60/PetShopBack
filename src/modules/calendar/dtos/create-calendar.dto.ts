import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  dateStringSchema,
  optionalDateStringSchema,
  stringSchema,
  uuidSchema,
} from 'src/shared/schemas.shared';

export const createCalendarSchema = z.object({
  description: stringSchema,
  initial_date: dateStringSchema,
  end_date: dateStringSchema,
  pet_id: uuidSchema,
  location: stringSchema,
  notification_date: optionalDateStringSchema,
});

export type CreateCalendarPayload = z.infer<typeof createCalendarSchema> & { user_id: string };

export class CreateCalendarDTO extends createZodDto(createCalendarSchema) {}
