import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  optionalStringSchema,
  optionalUuidSchema,
} from 'src/shared/schemas.shared';

export const updatePetBreedSchema = z.object({
  species_id: optionalUuidSchema,
  breed_name: optionalStringSchema,
});

export type UpdatePetBreedPayload = z.infer<typeof updatePetBreedSchema>;

export class UpdatePetBreedDTO extends createZodDto(updatePetBreedSchema) {
  /**
   * Name of the pet.
   * @example Golden Retriever
   */
  breed_name?: string;

  /**
   * Name of the pet.
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  species_id?: string;
}
