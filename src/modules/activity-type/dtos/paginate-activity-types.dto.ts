import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  optionalStringSchema,
  optionalPaginationParamSchema,
  optionalOrderParamSchema,
} from 'src/shared/schemas.shared';

export const paginateActivityTypesSchema = z.object({
  activity_name: optionalStringSchema,
  activity_description: optionalStringSchema,
  limit: optionalPaginationParamSchema,
  page: optionalPaginationParamSchema,
  order_by_created_at: optionalOrderParamSchema,
  order_by_updated_at: optionalOrderParamSchema,
});

export type PaginateActivityTypesPayload = z.infer<
  typeof paginateActivityTypesSchema
>;

export class PaginateActivityTypesDTO extends createZodDto(
  paginateActivityTypesSchema,
) {
  /**
   * activity_name.
   * @example Feriado
   */
  activity_name?: string;
  /**
   * activity_description
   * @example Sei la
   */
  activity_description?: string;
  /**
   * Order pets by created date.
   * @example ASC
   */
  order_by_created_at?: 'ASC' | 'DESC';
  /**
   * Order pets by updated date.
   * @example DESC
   */
  order_by_updated_at?: 'ASC' | 'DESC';
}
