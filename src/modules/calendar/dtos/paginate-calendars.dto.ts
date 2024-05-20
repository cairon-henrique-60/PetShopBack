import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  optionalOrderParamSchema,
  optionalPaginationParamSchema,
  optionalStringSchema,
  optionalUuidSchema,
} from 'src/shared/schemas.shared';

export const paginateCalendarsSchema = z.object({
  limit: optionalPaginationParamSchema,
  page: optionalPaginationParamSchema,
  description: optionalStringSchema,
  pet_id: optionalUuidSchema,
  user_id: optionalUuidSchema,
  order_by_created_at: optionalOrderParamSchema,
  order_by_updated_at: optionalOrderParamSchema,
  order_by_initial_date: optionalOrderParamSchema,
  order_by_end_date: optionalOrderParamSchema,
});

export type PaginateCalendarsPayload = z.infer<typeof paginateCalendarsSchema>;

export class PaginateCalendarsDTO extends createZodDto(
  paginateCalendarsSchema,
) {}
