import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import {
  optionalUuidSchema,
  optionalStringSchema,
} from 'src/shared/schemas.shared';

export const listSpeciesSchema = z.object({
  id: optionalUuidSchema,
  species_name: optionalStringSchema,
});

export type ListSpeciesPayload = z.infer<typeof listSpeciesSchema>;

export class ListSpeciesDTO extends createZodDto(listSpeciesSchema) {
  /**
   * Id of the species.
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id?: string;
  /**
   * Name of the species.
   */
  @ApiProperty({ example: 'Cachorro' })
  species_name?: string;
}
