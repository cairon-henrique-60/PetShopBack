import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  optionalDateStringSchema,
  optionalStringSchema,
  optionalUuidSchema,
} from 'src/shared/schemas.shared';

export const updateCalendarSchema = z.object({
  description: optionalStringSchema,
  initial_date: optionalDateStringSchema,
  end_date: optionalDateStringSchema,
  pet_id: optionalUuidSchema,
  location: optionalStringSchema,
  notification_date: optionalDateStringSchema,
});

export type UpdateCalendarPayload = z.infer<typeof updateCalendarSchema>

export class UpdateCalendarDTO extends createZodDto(updateCalendarSchema) {}
