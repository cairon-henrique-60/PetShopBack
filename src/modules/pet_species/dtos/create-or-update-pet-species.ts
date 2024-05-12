import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import { stringSchema } from 'src/shared/schemas.shared';

export const createOrUpdateSpeciesSchema = z.object({
  species_name: stringSchema.max(255),
});

export type CreateOrUpdateSpeciesPayload = z.infer<
  typeof createOrUpdateSpeciesSchema
>;

export class CreateOrUpdateSpeciesDTO extends createZodDto(
  createOrUpdateSpeciesSchema,
) {
  /**
   * Name of the species.
   */
  @ApiProperty({ example: 'Cachorro' })
  species_name: string;
}
