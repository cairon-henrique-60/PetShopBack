import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  optionalOrderParamSchema,
  optionalStringSchema,
} from 'src/shared/schemas.shared';

export const getAllActivityTypesFiltersSchema = z.object({
  activity_name: optionalStringSchema,
  activity_description: optionalStringSchema,
  order_by_created_at: optionalOrderParamSchema,
  order_by_updated_at: optionalOrderParamSchema,
});

export type ActivityTypesFilters = z.infer<
  typeof getAllActivityTypesFiltersSchema
>;

export class ActivityTypesFiltersDTO extends createZodDto(
  getAllActivityTypesFiltersSchema,
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
