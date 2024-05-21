import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  optionalStringSchema,
  optionalUuidSchema,
  optionalGenderStringSchema,
} from 'src/shared/schemas.shared';

export const listPetsQuerysSchema = z.object({
  id: optionalUuidSchema,
  pet_breed_id: optionalUuidSchema,
  pet_species_id: optionalUuidSchema,
  pet_name: optionalStringSchema,
  pet_gender: optionalGenderStringSchema,
  pet_color: optionalStringSchema,
});

export type ListPetsQuerysType = z.infer<typeof listPetsQuerysSchema>;

export class ListPetsQuerysDTO extends createZodDto(listPetsQuerysSchema) {
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
}
