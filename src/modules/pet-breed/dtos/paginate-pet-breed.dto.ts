import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  optionalOrderParamSchema,
  optionalPaginationParamSchema,
  optionalStringSchema,
  optionalUuidSchema,
} from 'src/shared/schemas.shared';

export const paginatePetBreedSchema = z.object({
  breed_name: optionalStringSchema,
  species_id: optionalUuidSchema,
  page: optionalPaginationParamSchema,
  limit: optionalPaginationParamSchema,
  order_by_created_at: optionalOrderParamSchema,
  order_by_updated_at: optionalOrderParamSchema,
});

export type PaginatePetBreedPayload = z.infer<typeof paginatePetBreedSchema>;

export class PaginatePetBreedDTO extends createZodDto(paginatePetBreedSchema) {
  /**
   * Id of the species.
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  species_id?: string;
  /**
   * @example Golden
   */
  breed_name_name?: string;
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
