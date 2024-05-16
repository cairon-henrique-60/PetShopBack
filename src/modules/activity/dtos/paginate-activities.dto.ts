import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  optionalUuidSchema,
  optionalStringSchema,
  optionalOrderParamSchema,
  optionalPaginationParamSchema,
} from 'src/shared/schemas.shared';

export const paginateActivitiesSchema = z.object({
  page: optionalPaginationParamSchema,
  limit: optionalPaginationParamSchema,
  activity_title: optionalStringSchema,
  activity_description: optionalStringSchema,
  activity_location: optionalStringSchema,
  pet_id: optionalUuidSchema,
  activity_type_id: optionalUuidSchema,
  order_by_created_at: optionalOrderParamSchema,
  order_by_updated_at: optionalOrderParamSchema,
});

export type PaginateActivitiesPayload = z.infer<
  typeof paginateActivitiesSchema
>;

export class PaginateActivitiesDTO extends createZodDto(
  paginateActivitiesSchema,
) {
  /**
   * Id do pet.
   */
  pet_id?: string;
  /**
   * Id do tipo de atividade
   */
  activity_type_id?: string;
  /**
   * activity_title.
   * @example Feriado
   */
  activity_title?: string;
  /**
   * activity_location.
   * @example Feriado
   */
  activity_location?: string;
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
