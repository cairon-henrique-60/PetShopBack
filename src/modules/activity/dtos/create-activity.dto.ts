import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  uuidSchema,
  stringSchema,
  dateStringSchema,
} from 'src/shared/schemas.shared';

export const createActivitySchema = z.object({
  activity_title: stringSchema,
  activity_description: stringSchema,
  activity_location: stringSchema,
  activity_date: dateStringSchema,
  activity_time: stringSchema,
  pet_id: uuidSchema,
  activity_type_id: uuidSchema,
});

export type CreateActivityPayload = z.infer<typeof createActivitySchema>;

export class CreateActivityDTO extends createZodDto(createActivitySchema) {
  /**
   * @example Feriado
   */
  activity_title: string;
  /**
   * @example Sei la
   */
  activity_description: string;
  /**
   * @example Paulista
   */
  activity_location: string;
  /**
   * @example 2024-05-10
   */
  activity_date: Date;
  /**
   * @example 05:10
   */
  activity_time: string;
  /**
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  pet_id: string;
  /**
   * @example 123e4567-e89b-12d3-a456-426614174111
   */
  activity_type_id: string;
}
