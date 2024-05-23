import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import { stringSchema, uuidSchema } from 'src/shared/schemas.shared';

export const createPetBreedSchema = z.object({
  species_id: uuidSchema,
  breed_name: stringSchema,
});

export type CreatePetBreedPayload = z.infer<typeof createPetBreedSchema>;

export class CreatePetBreedDTO extends createZodDto(createPetBreedSchema) {
  @ApiProperty({ default: 'Pitbull' })
  /**
   * Name of the pet.
   * @example Golden Retriever
   */
  breed_name: string;

  /**
   * Id of the species.
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  species_id: string;
}
