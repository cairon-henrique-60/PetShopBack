import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  optionalPaginationParamSchema,
  optionalStringSchema,
  optionalUuidSchema,
  optionalOrderParamSchema,
} from 'src/shared/schemas.shared';

export const paginatePetsQuerysSchema = z.object({
  page: optionalPaginationParamSchema,
  limit: optionalPaginationParamSchema,
  pet_breed: optionalStringSchema,
  pet_name: optionalStringSchema,
  pet_gender: optionalStringSchema,
  pet_color: optionalStringSchema,
  tutor_id: optionalUuidSchema,
  order_by_created_at: optionalOrderParamSchema,
  order_by_updated_at: optionalOrderParamSchema,
});

export type PaginatePetsQuerysType = z.infer<typeof paginatePetsQuerysSchema>;

export const swaggerFields = [
  {
    name: 'order_by_created_at',
    description: 'Order pets by created date.',
    required: false,
    type: String,
  },
  {
    name: 'order_by_updated_at',
    description: 'Order pets by updated date',
    required: false,
    type: String,
  },
];

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
   * @example Labrador Retriever
   */
  pet_breed?: string;
  /**
   * Gender of the pet.
   * @example Female
   */
  pet_gender?: string;
  /**
   * Color of the pet.
   * @example Golden
   */
  pet_color?: string;
  /**
   * ID of the tutor (owner) of the pet.
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  tutor_id?: string;
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
