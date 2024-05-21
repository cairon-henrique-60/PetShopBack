import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  optionalPaginationParamSchema,
  optionalStringSchema,
  optionalUuidSchema,
  optionalOrderParamSchema,
  optionalGenderStringSchema,
} from 'src/shared/schemas.shared';

export const paginatePetsQuerysSchema = z.object({
  page: optionalPaginationParamSchema,
  limit: optionalPaginationParamSchema,
  pet_breed_id: optionalUuidSchema,
  pet_species_id: optionalUuidSchema,
  pet_name: optionalStringSchema,
  pet_gender: optionalGenderStringSchema,
  pet_color: optionalStringSchema,
  order_by_created_at: optionalOrderParamSchema,
  order_by_updated_at: optionalOrderParamSchema,
});

export type PaginatePetsQuerysType = z.infer<typeof paginatePetsQuerysSchema>;

export class PaginatePetsQuerysDTO extends createZodDto(
  paginatePetsQuerysSchema,
) {
  /**
   * Name of the pet.
   * @example Luna
   */
  pet_name?: string;
  /**
   * Breed of the pet.
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  pet_breed_id?: string;
  /**
   * Specie of the pet.
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  pet_species_id?: string;
  /**
   * Gender of the pet.
   * @example Female
   */
  pet_gender?: 'F' | 'M';
  /**
   * Color of the pet.
   * @example Golden
   */
  pet_color?: string;
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
