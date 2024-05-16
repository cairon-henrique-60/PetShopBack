import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { optionalStringSchema } from 'src/shared/schemas.shared';

export const updateActivityTypeSchema = z.object({
  activity_name: optionalStringSchema,
  activity_description: optionalStringSchema,
});

export type UpdateActivityTypePayload = z.infer<
  typeof updateActivityTypeSchema
>;

export class UpdateActivityTypeDTO extends createZodDto(
  updateActivityTypeSchema,
) {
  /**
   * activity_name.
   * @example Feriado
   */
  activity_name?: string;
  /**
   * activity_description
   * @example Sei la
   */
  activity_description?: string;
}
