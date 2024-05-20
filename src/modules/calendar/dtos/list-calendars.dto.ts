import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  optionalDatetimeStringSchema,
  optionalOrderParamSchema,
  optionalStringSchema,
  optionalUuidSchema,
} from 'src/shared/schemas.shared';

export const listCalendarsSchema = z.object({
  description: optionalStringSchema,
  pet_id: optionalUuidSchema,
  user_id: optionalUuidSchema,
  end_date: optionalDatetimeStringSchema,
  initial_date: optionalDatetimeStringSchema,
  order_by_created_at: optionalOrderParamSchema,
  order_by_updated_at: optionalOrderParamSchema,
  order_by_initial_date: optionalOrderParamSchema,
  order_by_end_date: optionalOrderParamSchema,
});

export type ListCalendarsPayload = z.infer<typeof listCalendarsSchema>;

export class ListCalendarsDTO extends createZodDto(listCalendarsSchema) {}
