import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  optionalStringSchema,
  optionalUuidSchema,
} from 'src/shared/schemas.shared';

export const listPetBreedSchema = z.object({
  breed_name: optionalStringSchema,
  species_id: optionalUuidSchema,
});

export type ListPetBreedPayload = z.infer<typeof listPetBreedSchema>;

export class ListPetBreedDTO extends createZodDto(listPetBreedSchema) {
  /**
   * Id of the species.
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  species_id?: string;
  /**
   * @example Golden
   */
  breed_name_name?: string;
}
