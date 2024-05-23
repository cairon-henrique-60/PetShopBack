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
  order_by_created_at: optionalOrderParamSchema,
  order_by_updated_at: optionalOrderParamSchema,
  order_by_initial_date: optionalOrderParamSchema,
  order_by_end_date: optionalOrderParamSchema,
});

export type PaginateCalendarsPayload = z.infer<typeof paginateCalendarsSchema>;

export class PaginateCalendarsDTO extends createZodDto(
  paginateCalendarsSchema,
) {
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
