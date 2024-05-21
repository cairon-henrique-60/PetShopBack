import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  stringSchema,
  optionalDateStringSchema,
  optionalStringSchema,
  uuidSchema,
  optionalGenderStringSchema
} from 'src/shared/schemas.shared';

export const createPetSchema = z.object({
  pet_name: stringSchema,
  pet_breed_id: uuidSchema,
  date_of_birth: optionalDateStringSchema,
  pet_gender: optionalGenderStringSchema,
  pet_color: stringSchema,
  alergies: optionalStringSchema,
  medical_conditions: optionalStringSchema,
  current_medication: optionalStringSchema,
  pet_microship_id: optionalStringSchema,
  pet_species_id: uuidSchema,
});

export type CreatePetPayload = z.infer<typeof createPetSchema>;

/**
 * DTO for creating a new pet.
 */
export class CreatePetDTO extends createZodDto(createPetSchema) {
  /**
   * Name of the pet.
   * @example Luna
   */
  pet_name: string;
  /**
   * Breed of the pet.
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  pet_breed_id: string;
  /**
   * Date of birth of the pet.
   * @example 2020-01-15
   */
  date_of_birth?: Date;
  /**
   * Gender of the pet.
   * @example F | M
   */
  pet_gender: 'F' | 'M';
  /**
   * Color of the pet.
   * @example Golden
   */
  pet_color: string;
  /**
   * Any allergies the pet may have.
   * @example Pollen
   */
  alergies?: string;
  /**
   * Any medical conditions the pet may have.
   * @example Hip dysplasia
   */
  medical_conditions?: string;
  /**
   * Current medication the pet is taking.
   * @example None
   */
  current_medication?: string;
  /**
   * Microchip ID of the pet.
   * @example A123456789
   */
  pet_microship_id?: string;
  /**
   * ID of the species the pet belongs to.
   * @example 123e4567-e89b-12d3-a456-426614174001
   */
  pet_species_id: string;
}
