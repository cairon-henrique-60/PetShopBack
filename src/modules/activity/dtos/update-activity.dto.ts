import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  optionalUuidSchema,
  optionalStringSchema,
  optionalDateStringSchema,
} from 'src/shared/schemas.shared';

export const updateActivitySchema = z.object({
  activity_title: optionalStringSchema,
  activity_description: optionalStringSchema,
  activity_location: optionalStringSchema,
  activity_date: optionalDateStringSchema,
  activity_time: optionalStringSchema,
  pet_id: optionalUuidSchema,
  activity_type_id: optionalUuidSchema,
});

export type UpdateActivityPayload = z.infer<typeof updateActivitySchema>;

export class UpdateActivityDTO extends createZodDto(updateActivitySchema) {
  /**
   * @example Feriado
   */
  activity_title?: string;
  /**
   * @example Sei la
   */
  activity_description?: string;
  /**
   * @example Paulista
   */
  activity_location?: string;
  /**
   * @example 2024-05-10
   */
  activity_date?: Date;
  /**
   * @example 05:10
   */
  activity_time?: string;
  /**
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  pet_id?: string;
  /**
   * @example 123e4567-e89b-12d3-a456-426614174111
   */
  activity_type_id?: string;
}
