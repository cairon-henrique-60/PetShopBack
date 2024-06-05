import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  optionalStringSchema,
  optionalDateStringSchema,
  optionalUuidSchema,
  optionalGenderStringSchema,
} from 'src/shared/schemas.shared';

export const updatePetSchema = z
  .object({
    pet_name: optionalStringSchema,
    pet_breed_id: optionalUuidSchema,
    date_of_birth: optionalDateStringSchema,
    pet_gender: optionalGenderStringSchema,
    pet_color: optionalStringSchema,
    alergies: optionalStringSchema,
    medical_conditions: optionalStringSchema,
    current_medication: optionalStringSchema,
    pet_microship_id: optionalStringSchema,
    tutor_id: optionalUuidSchema,
    pet_species_id: optionalUuidSchema,
  })
  .refine(
    ({ pet_species_id, pet_breed_id }) => {
      if (pet_species_id && !pet_breed_id) return false;
      return true
    },
    {
      message: 'Caso queira mudar a especie insira uma raça!',
      path: ['pet_breed_id'],
    },
  );

export type UpdatePetPayload = z.infer<typeof updatePetSchema>;

export class UpdatePetDTO extends createZodDto(updatePetSchema) {
  /**
   * Name of the pet.
   * @example Luna
   */
  pet_name?: string;
  /**
   * Breed of the pet.
   * @example Labrador Retriever
   */
  pet_breed_id?: string;
  /**
   * Date of birth of the pet.
   * @example 2020-01-15
   */
  date_of_birth?: Date;
  /**
   * Gender of the pet.
   * @example F | M
   */
  pet_gender?: 'F' | 'M';
  /**
   * Color of the pet.
   * @example Golden
   */
  pet_color?: string;
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
   * ID of the tutor (owner) of the pet.
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  tutor_id: string;
  /**
   * ID of the species the pet belongs to.
   * @example 123e4567-e89b-12d3-a456-426614174001
   */
  pet_species_id: string;
}
